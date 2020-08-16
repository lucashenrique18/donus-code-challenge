import { HttpRequest, HttpResponse, Controller, CpfValidator } from '../../protocols'
import { MissingParamError, InvalidParamError } from '../../errors'
import { badRequest, serverError } from '../../helpers/http-helper'
import { AddAccount } from '../../../domain/usecases/add-account/add-account'

export class SignUpController implements Controller {
  private readonly cpfValidator: CpfValidator
  private readonly addAccount: AddAccount

  constructor (cpfValidator: CpfValidator, addAccount: AddAccount) {
    this.cpfValidator = cpfValidator
    this.addAccount = addAccount
  }

  handle (httpRequest: HttpRequest): HttpResponse {
    try{
      const requiredFields = ['name', 'cpf', 'password', 'passwordConfirmation']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }
      const {name, cpf, password, passwordConfirmation} = httpRequest.body
      const isValidCpf = this.cpfValidator.isValid(cpf)
      if (!isValidCpf) {
        return badRequest(new InvalidParamError('cpf'))
      }
      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }
      this.addAccount.add({
        name,
        cpf,
        password
      })
    } catch (error) {
      console.error(error)
      return serverError()
    }
  }
}
