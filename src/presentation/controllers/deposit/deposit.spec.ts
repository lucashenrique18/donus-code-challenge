import { MissingParamError } from '../../errors'
import { DepositController } from './deposit'

describe('Deposit Controller', () => {
  test('Should return 400 if no cpf is provided', async () => {
    const sut = new DepositController()
    const httpRequest = {
      body: {
        password: 'any_password',
        depositValue: 100.00
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('cpf'))
  })

  test('Should return 400 if no password is provided', async () => {
    const sut = new DepositController()
    const httpRequest = {
      body: {
        cpf: 'any_cpf',
        depositValue: 100.00
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  test('Should return 400 if no depositValue is provided', async () => {
    const sut = new DepositController()
    const httpRequest = {
      body: {
        cpf: 'any_cpf',
        password: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('depositValue'))
  })

})
