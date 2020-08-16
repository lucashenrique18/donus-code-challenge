import { HttpRequest, HttpResponse } from '../../protocols/http'
import { MissingParamError, InvalidParamError } from '../../errors'
import { badRequest, serverError } from '../../helpers/http-helper'
import { Controller } from '../../protocols/controller'
import { CpfValidator } from '../../protocols/cpf-validator'

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
      const {name, cpf, password, passwordConfirmation} = httpRequest.body
      const isValidCpf = this.cpfValidator.isValid(httpRequest.body.cpf)
      if (!isValidCpf) {
        return badRequest(new InvalidParamError('cpf'))
      }
      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }
    } catch (error) {
      console.error(error)
      return serverError()
    }
  }
}
