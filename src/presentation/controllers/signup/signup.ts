import { HttpResponse, HttpRequest, Controller, CpfValidator, AddAccount } from './signup-protocols'
import { MissingParamError, InvalidParamError, CpfInUseError } from '../../errors'
import { badRequest, serverError, ok, unprocessable } from '../../helpers/http-helper'

export class SignUpController implements Controller {
  constructor (private readonly cpfValidator: CpfValidator, private readonly addAccount: AddAccount) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try{
      const requiredFields = ['name', 'cpf', 'password', 'passwordConfirmation']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }
      const {name, cpf, password, passwordConfirmation} = httpRequest.body
      const isValidCpf = this.cpfValidator.isValid(cpf)
      if (!isValidCpf) {
        return badRequest(new InvalidParamError('cpf'))
      }
      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }
      const account = await this.addAccount.add({
        name,
        cpf,
        password
      })
      if(!account) {
        return unprocessable(new CpfInUseError())
      }
      return ok(account)
    } catch (error) {
      console.error(error)
      return serverError()
    }
  }
}
