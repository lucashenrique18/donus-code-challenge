import { MissingParamError, InvalidParamError } from '../../errors'
import { TransferController } from './transfer'
import { CpfValidator } from '../../protocols/cpf-validator'

const validValue = 100

const makeCpfValidator = (): CpfValidator => {
  class CpfValidatorStub implements CpfValidator {
    isValid (cpf: string): boolean {
      return true
    }
  }
  return new CpfValidatorStub()
}

interface SutTypes {
  sut: TransferController
  cpfValidatorStub: CpfValidator
}

const makeSut = (): SutTypes => {
  const cpfValidatorStub = makeCpfValidator()
  const sut = new TransferController(cpfValidatorStub)
  return {
    sut,
    cpfValidatorStub
  }
}

describe('Transfer Controller', () => {
  test('Should return 400 if no cpf is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        password: 'any_password',
        beneficiaryCpf: 'any_beneficiary',
        value: validValue
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('cpf'))
  })

  test('Should return 400 if no password is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        cpf: 'any_cpf',
        beneficiaryCpf: 'any_beneficiary',
        value: validValue
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  test('Should return 400 if no beneficiaryCpf is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        cpf: 'any_cpf',
        password: 'any_password',
        value: validValue
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('beneficiaryCpf'))
  })

  test('Should return 400 if no value is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        cpf: 'any_cpf',
        password: 'any_password',
        beneficiaryCpf: 'any_beneficiary'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('value'))
  })

  test('Should return 400 if an invalid cpf is provided ', async () => {
    const { sut, cpfValidatorStub } = makeSut()
    jest.spyOn(cpfValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpRequest = {
      body: {
        cpf: 'any_cpf',
        password: 'any_password',
        beneficiaryCpf: 'any_beneficiary',
        value: validValue
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('cpf'))
  })

})
