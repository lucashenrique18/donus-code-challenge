import { MissingParamError } from '../../errors'
import { TransferController } from './transfer'

interface SutTypes {
  sut: TransferController
}

const makeSut = (): SutTypes => {
  const sut = new TransferController()
  return {
    sut
  }
}

describe('Transfer Controller', () => {
  test('Should return 400 if no cpf is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        password: 'any_password',
        beneficiary: 'any_beneficiary',
        value: 100
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('cpf'))
  })

})
