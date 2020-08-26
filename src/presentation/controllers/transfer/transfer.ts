import { MissingParamError, InvalidParamError } from '../../errors'
import { Controller, HttpRequest, HttpResponse } from '../../protocols'
import { badRequest, serverError, unauthorized, ok } from '../../helpers/http-helper'
import { CpfValidator, Authentication, TransferMoney } from './transfer-protocol'

export class TransferController implements Controller {

  constructor (private readonly cpfValidator: CpfValidator, private readonly authentication: Authentication, private readonly transferMoney: TransferMoney) {}

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
      const isAuth = await this.authentication.auth(cpf.replace(/([-.]*)/g, ''), password)
      if (!isAuth) {
        return unauthorized()
      }
      const transfer = await this.transferMoney.transfer({
        cpf: cpf.replace(/([-.]*)/g, ''), password, beneficiaryCpf, value
      })
      if (transfer === null) {
        return badRequest(new InvalidParamError('beneficiaryCpf'))
      }
      if (transfer === undefined) {
        return badRequest(new InvalidParamError('value'))
      }
      return ok(transfer)
    } catch (error) {
      console.error(error)
      return serverError()
    }
  }

}
