import { Controller, HttpRequest, HttpResponse } from "../../protocols";
import { CpfValidator } from '../../protocols/cpf-validator'
import { Authentication } from '../../../domain/usecases/authentication/authentication'
import { badRequest, serverError, unauthorized } from '../../helpers/http-helper'
import { MissingParamError, InvalidParamError } from '../../errors'

export class MovimentationController implements Controller {
  constructor (private readonly cpfValidator: CpfValidator, private readonly authentication: Authentication) {}
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
    } catch (error) {
      console.error(error)
      return serverError()
    }
  }
}