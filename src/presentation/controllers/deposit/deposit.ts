import { Controller, HttpRequest, HttpResponse } from "../../protocols";
import { MissingParamError, InvalidParamError } from '../../errors'
import { badRequest, serverError } from '../../helpers/http-helper'
import { CpfValidator } from '../../protocols/cpf-validator'
import { DepositAmount } from "../../../domain/usecases/deposit-amount/deposit-amount";
import { Authentication } from '../../../domain/usecases/authentication/authentication'

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
      this.authentication.auth(cpf, password)
      await this.depositAmount.deposit({
         cpf, password, depositValue
      })
    } catch (error) {
      console.error(error)
      return serverError()
    }
  }

}
