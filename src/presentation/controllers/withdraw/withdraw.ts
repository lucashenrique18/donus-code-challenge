import { unauthorized, badRequest, serverError, ok } from "../../helpers/http-helper"
import { InvalidParamError, MissingParamError } from "../../errors"
import { WithdrawMoney, HttpResponse, HttpRequest, Controller, CpfValidator, Authentication } from './withdraw-protocols'

export class WithdrawController implements Controller {
  constructor (private readonly cpfValidator: CpfValidator, private readonly authentication: Authentication, private readonly withdrawMoney: WithdrawMoney) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try{
      const requiredFields = ['cpf', 'password', 'value']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }
      const { cpf, password, value } = httpRequest.body
      const isValidCpf = this.cpfValidator.isValid(cpf)
      if (!isValidCpf) {
        return badRequest(new InvalidParamError('cpf'))
      }
      if (value <= 0) {
        return badRequest(new InvalidParamError('value'))
      }
      const isAuth = await this.authentication.auth(cpf.replace(/([-.]*)/g, ''), password)
      if (!isAuth) {
        return unauthorized()
      }
      const withdraw = await this.withdrawMoney.withdraw({
        cpf: cpf.replace(/([-.]*)/g, ''), password, value
      })
      return ok(withdraw)
    } catch (error) {
      console.error(error)
      return serverError()
    }
  }

}

