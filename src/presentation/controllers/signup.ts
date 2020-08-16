import { HttpRequest, HttpResponse } from '../protocols/http'

export class SignUpController {
  handle (httpRequest: HttpRequest): HttpResponse {
    if(!httpRequest.body.name) {
      return {
        statusCode: 400,
        body: new Error('Missing param: name')
      }
    }
    if(!httpRequest.body.cpf) {
      return {
        statusCode: 400,
        body: new Error('Missing param: cpf')
      }
    }
  }
}