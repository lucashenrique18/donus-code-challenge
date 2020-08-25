import { MissingParamError, InvalidParamError } from '../../errors'
import { Controller, HttpRequest, HttpResponse } from '../../protocols'
import { badRequest } from '../../helpers/http-helper'
import { CpfValidator } from '../../protocols/cpf-validator'

export class TransferController implements Controller {

  constructor (private readonly cpfValidator: CpfValidator) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const requiredFields = ['cpf', 'password', 'beneficiaryCpf', 'value' ]
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }
    const { cpf, password, beneficiaryCpf, value } = httpRequest.body
    const isValidCpf = this.cpfValidator.isValid(cpf)
    if (!isValidCpf) {
      return badRequest(new InvalidParamError('cpf'))
    }
  }

}
