import { Controller, HttpRequest, HttpResponse } from "../../protocols";
import { CpfValidator } from '../../protocols/cpf-validator'
import { Authentication } from '../../../domain/usecases/authentication/authentication'
import { badRequest, serverError, unauthorized, ok } from '../../helpers/http-helper'
import { MissingParamError, InvalidParamError } from '../../errors'
import { LoadMovimentation } from "../../../domain/usecases/movimentation/movimentation";

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