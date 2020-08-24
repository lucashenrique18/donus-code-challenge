import { CpfValidator, Authentication, LoadMovimentation, Controller, HttpResponse, HttpRequest } from './movimentation-protocol'
import { badRequest, serverError, unauthorized, ok } from '../../helpers/http-helper'
import { MissingParamError, InvalidParamError } from '../../errors'

export class MovimentationController implements Controller {
  constructor (private readonly cpfValidator: CpfValidator, private readonly authentication: Authentication, private readonly loadMovimentation: LoadMovimentation) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try{
      const requiredFields = ['cpf', 'password']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }
      const { cpf, password } = httpRequest.body
      const isValidCpf = this.cpfValidator.isValid(cpf)
      if (!isValidCpf) {
        return badRequest(new InvalidParamError('cpf'))
      }
      const isAuth = await this.authentication.auth(cpf, password)
      if (!isAuth) {
        return unauthorized()
      }
      const movimentations = await this.loadMovimentation.load({cpf, password})
      return ok(movimentations)
    } catch (error) {
      console.error(error)
      return serverError()
    }
  }
}