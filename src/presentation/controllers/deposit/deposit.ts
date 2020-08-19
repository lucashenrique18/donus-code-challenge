import { Controller, HttpRequest, HttpResponse } from "../../protocols";
import { MissingParamError } from '../../errors'
import { badRequest } from '../../helpers/http-helper'

export class DepositController implements Controller {

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const requiredFields = ['cpf']
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }
    return null
  }

}
