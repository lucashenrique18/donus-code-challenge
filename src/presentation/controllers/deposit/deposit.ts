import { Controller, HttpRequest, HttpResponse } from "../../protocols";
import { MissingParamError, InvalidParamError } from '../../errors'
import { badRequest, serverError } from '../../helpers/http-helper'
import { CpfValidator } from '../../protocols/cpf-validator'
import { DepositAmount } from "../../../domain/usecases/deposit-amount/deposit-amount";

export class DepositController implements Controller {
  private readonly cpfValidator: CpfValidator
  private readonly depositAmount: DepositAmount

  constructor (cpfValidator: CpfValidator, depositAmount: DepositAmount) {
    this.cpfValidator = cpfValidator
    this.depositAmount = depositAmount
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try{
      const requiredFields = ['cpf', 'password', 'depositValue']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }
      const { cpf, depositValue } = httpRequest.body
      const isValidCpf = this.cpfValidator.isValid(cpf)
      if (!isValidCpf) {
        return badRequest(new InvalidParamError('cpf'))
      }
      if (depositValue <= 0) {
        return badRequest(new InvalidParamError('depositValue'))
      }
      await this.depositAmount.deposit(httpRequest.body)
      return null
    } catch (error) {
      console.error(error)
      return serverError()
    }
  }

}
