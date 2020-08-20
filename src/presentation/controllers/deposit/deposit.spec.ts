import { MissingParamError, InvalidParamError, ServerError } from '../../errors'
import { DepositController } from './deposit'
import { CpfValidator } from '../../protocols/cpf-validator'
import { DepositAmount, DepositAmountModel } from '../../../domain/usecases/deposit-amount/deposit-amount'
import { DepositModel } from '../../../domain/models/deposit-model'

interface SutTypes {
  sut: DepositController
  cpfValidatorStub: CpfValidator,
  depositAmountStub: DepositAmount
}

const makeDepositAmount = (): DepositAmount => {
  class DepositAmountStub implements DepositAmount {
    async deposit (deposit: DepositAmountModel): Promise<DepositModel> {
      const fakeDeposit = {
        name: 'valid_name',
        cpf: 'valid_cpf',
        depositValue: 0
      }
      return new Promise(resolve => resolve(fakeDeposit))
    }
  }
  return new DepositAmountStub()
}

const makeCpfValidator = (): CpfValidator => {
  class CpfValidatorStub implements CpfValidator {
    isValid (cpf: string): boolean {
      return true
    }
  }
  return new CpfValidatorStub()
}

const makeSut = (): SutTypes => {
  const cpfValidatorStub = makeCpfValidator()
  const depositAmountStub = makeDepositAmount()
  const sut = new DepositController(cpfValidatorStub, depositAmountStub)
  return {
    sut,
    cpfValidatorStub,
    depositAmountStub
  }
}

const validDepositValue = 100
const invalidDepositValue = -100

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

  test('Should return 400 if an invalid depositValue is provided ', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        cpf: 'any_cpf',
        password: 'any_password',
        depositValue: invalidDepositValue
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('depositValue'))
  })

  test('Should return 500 if CpfValidator throws', async () => {
    const { sut, cpfValidatorStub } = makeSut()
    jest.spyOn(cpfValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpRequest = {
      body: {
        cpf: 'any_cpf',
        password: 'any_password',
        depositValue: validDepositValue
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Should return 500 if DepositAmount throws', async () => {
    const { sut, depositAmountStub } = makeSut()
    jest.spyOn(depositAmountStub, 'deposit').mockImplementationOnce(async () => {
      return new Promise((resolve, reject) => reject(new Error()))
    })
    const httpRequest = {
      body: {
        cpf: 'any_cpf',
        password: 'any_password',
        depositValue: validDepositValue
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

})
