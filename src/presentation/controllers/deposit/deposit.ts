import { MissingParamError, InvalidParamError } from '../../errors'
import { badRequest, serverError, unauthorized, ok } from '../../helpers/http-helper'
import { Authentication, DepositAmount, CpfValidator, Controller, HttpRequest, HttpResponse } from './deposit-protocol'

export class DepositController implements Controller {
  constructor (private readonly cpfValidator: CpfValidator, private readonly depositAmount: DepositAmount, private readonly authentication: Authentication) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try{
      const requiredFields = ['cpf', 'password', 'depositValue']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }
      const { cpf, password, depositValue } = httpRequest.body
      const isValidCpf = this.cpfValidator.isValid(cpf)
      if (!isValidCpf) {
        return badRequest(new InvalidParamError('cpf'))
      }
      if (depositValue <= 0) {
        return badRequest(new InvalidParamError('depositValue'))
      }
      const isAuth = await this.authentication.auth(cpf.replace(/([-.]*)/g, ''), password)
      if (!isAuth) {
        return unauthorized()
      }
      const deposit = await this.depositAmount.deposit({
         cpf: cpf.replace(/([-.]*)/g, ''), password, depositValue
      })
      return ok(deposit)
    } catch (error) {
      console.error(error)
      return serverError()
    }
  }

}
