export class SignUpController {
  handle (httpRequest: any): any {
    if(!httpRequest.body.name) {
      return {
        statusCode: 400
      }
    }
  }
}