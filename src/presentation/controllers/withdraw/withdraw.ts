import { unauthorized, badRequest, serverError, ok } from "../../helpers/http-helper"
import { InvalidParamError, MissingParamError } from "../../errors"
import { HttpResponse, HttpRequest, Controller } from "../../protocols"
import { CpfValidator } from "../../protocols/cpf-validator"
import { Authentication } from "../../../domain/usecases/authentication/authentication"

export class WithdrawController implements Controller {
  constructor (private readonly cpfValidator: CpfValidator, private readonly authentication: Authentication) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try{
      const requiredFields = ['cpf', 'password', 'value']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }
      const { cpf, password, value } = httpRequest.body
      const isValidCpf = this.cpfValidator.isValid(cpf)
      if (!isValidCpf) {
        return badRequest(new InvalidParamError('cpf'))
      }
      if (value <= 0) {
        return badRequest(new InvalidParamError('value'))
      }
      const isAuth = await this.authentication.auth(cpf.replace(/([-.]*)/g, ''), password)
      if (!isAuth) {
        return unauthorized()
      }
      return null
    } catch (error) {
      console.error(error)
      return serverError()
    }
  }

}

