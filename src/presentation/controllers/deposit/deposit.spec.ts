import { MissingParamError, InvalidParamError } from '../../errors'
import { DepositController } from './deposit'
import { CpfValidator } from '../../protocols/cpf-validator'

interface SutTypes {
  sut: DepositController
  cpfValidatorStub: CpfValidator
}

const makeSut = (): SutTypes => {
  class CpfValidatorStub implements CpfValidator {
    isValid (cpf: string): boolean {
      return true
    }
  }
  const cpfValidatorStub = new CpfValidatorStub()
  const sut = new DepositController(cpfValidatorStub)
  return {
    sut,
    cpfValidatorStub
  }
}

const validDepositValue = 100

describe('Deposit Controller', () => {
  test('Should return 400 if no cpf is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        password: 'any_password',
        depositValue: validDepositValue
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
        depositValue: validDepositValue
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  test('Should return 400 if no depositValue is provided', async () => {
    const { sut } = makeSut()
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

  test('Should return 400 if an invalid cpf is provided ', async () => {
    const { sut, cpfValidatorStub } = makeSut()
    jest.spyOn(cpfValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpRequest = {
      body: {
        cpf: 'invalid_cpf',
        password: 'any_password',
        depositValue: validDepositValue
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('cpf'))
  })

  test('Should call CpfValidator with correct cpf', async () => {
    const { sut, cpfValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(cpfValidatorStub, 'isValid')
    const httpRequest = {
      body: {
        cpf: 'any_cpf',
        password: 'any_password',
        depositValue: validDepositValue
      }
    }
    await sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith('any_cpf')
  })

})
