import { Controller, HttpRequest, HttpResponse } from "../../protocols";
import { MissingParamError, InvalidParamError } from '../../errors'
import { badRequest } from '../../helpers/http-helper'
import { CpfValidator } from '../../protocols/cpf-validator'

export class DepositController implements Controller {
  private readonly cpfValidator: CpfValidator

  constructor (cpfValidator: CpfValidator) {
    this.cpfValidator = cpfValidator
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const requiredFields = ['cpf', 'password', 'depositValue']
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }
    const { cpf } = httpRequest.body
    const isValidCpf = this.cpfValidator.isValid(cpf)
    if (!isValidCpf) {
      return badRequest(new InvalidParamError('cpf'))
    }
    return null
  }

}
