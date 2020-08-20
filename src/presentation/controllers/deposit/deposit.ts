import { MissingParamError, InvalidParamError } from '../../errors'
import { badRequest, serverError, unauthorized, ok } from '../../helpers/http-helper'
import { Authentication, DepositAmount, CpfValidator, Controller, HttpRequest, HttpResponse } from './deposit-protocol'

export class DepositController implements Controller {
  private readonly cpfValidator: CpfValidator
  private readonly depositAmount: DepositAmount
  private readonly authentication: Authentication

  constructor (cpfValidator: CpfValidator, depositAmount: DepositAmount, authentication: Authentication) {
    this.cpfValidator = cpfValidator
    this.depositAmount = depositAmount
    this.authentication = authentication
  }

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
      const isAuth = await this.authentication.auth(cpf, password)
      if (!isAuth) {
        return unauthorized()
      }
      const deposit = await this.depositAmount.deposit({
         cpf, password, depositValue
      })
      return ok(deposit)
    } catch (error) {
      console.error(error)
      return serverError()
    }
  }

}
