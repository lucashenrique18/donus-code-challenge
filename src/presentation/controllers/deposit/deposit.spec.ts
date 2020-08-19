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
})
