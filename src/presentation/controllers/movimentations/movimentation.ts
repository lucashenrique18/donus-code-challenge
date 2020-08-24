import { Controller, HttpRequest, HttpResponse } from "../../protocols";
import { CpfValidator } from '../../protocols/cpf-validator'
import { badRequest } from '../../helpers/http-helper'
import { MissingParamError, InvalidParamError } from '../../errors'

export class MovimentationController implements Controller {
  constructor (private readonly cpfValidator: CpfValidator) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const requiredFields = ['cpf', 'password']
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }
    const isValidCpf = this.cpfValidator.isValid(httpRequest.body.cpf)
    if (!isValidCpf) {
      return badRequest(new InvalidParamError('cpf'))
    }
  }
}