import { HttpRequest, HttpResponse } from '../../protocols/http'
import { MissingParamError } from '../../errors/missing-param-error'
import { badRequest, serverError } from '../../helpers/http-helper'
import { Controller } from '../../protocols/controller'
import { CpfValidator } from '../../protocols/cpf-validator'
import { InvalidParamError } from '../../errors/invalid-param-error'

export class SignUpController implements Controller {
  private readonly cpfValidator: CpfValidator

  constructor (cpfValidator: CpfValidator) {
    this.cpfValidator = cpfValidator
  }

  handle (httpRequest: HttpRequest): HttpResponse {
    try{
      const requiredFields = ['name', 'cpf', 'password', 'passwordConfirmation']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }
      const isValidCpf = this.cpfValidator.isValid(httpRequest.body.cpf)
      if (!isValidCpf) {
        return badRequest(new InvalidParamError('cpf'))
      }
    } catch (error) {
      console.error(error)
      return serverError()
    }
  }
}
