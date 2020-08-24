import { Controller, HttpRequest, HttpResponse } from "../../protocols";
import { badRequest } from '../../helpers/http-helper'
import { MissingParamError } from '../../errors'

export class MovimentationController implements Controller {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const requiredFields = ['cpf', 'password']
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }
  }
}