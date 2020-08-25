import { MissingParamError, InvalidParamError } from '../../errors'
import { Controller, HttpRequest, HttpResponse } from '../../protocols'
import { badRequest, serverError } from '../../helpers/http-helper'
import { CpfValidator } from '../../protocols/cpf-validator'

export class TransferController implements Controller {

  constructor (private readonly cpfValidator: CpfValidator) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
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
      const isValidBeneficiaryCpf = this.cpfValidator.isValid(beneficiaryCpf)
      if (!isValidBeneficiaryCpf) {
        return badRequest(new InvalidParamError('beneficiaryCpf'))
      }
      if (value <= 0) {
        return badRequest(new InvalidParamError('value'))
      }

    } catch (error) {
      console.error(error)
      return serverError()
    }
  }

}
