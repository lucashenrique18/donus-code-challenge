export class SignUpController {
  handle (httpRequest: any): any {
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