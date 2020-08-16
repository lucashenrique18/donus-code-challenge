import { SignUpController } from './signup'

describe('SignUp Controller', () => {

  test('Should return 400 if no name is provided ', () => {
    const sut = new SignUpController()
    const httpRequest = {
      body: {
        cpf: 'any_cpf',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
  })


})
