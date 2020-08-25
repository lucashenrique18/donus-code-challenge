import { MissingParamError } from '../../errors'
import { Controller, HttpRequest, HttpResponse } from '../../protocols'
import { badRequest } from '../../helpers/http-helper'

export class TransferController implements Controller {

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const requiredFields = ['cpf', 'password', 'beneficiary', 'value' ]
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }
  }

}
