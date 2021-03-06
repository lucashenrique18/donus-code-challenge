import { MissingParamError, InvalidParamError, ServerError, UnauthorizedError } from '../../errors'
import { TransferController } from './transfer'
import { CpfValidator } from '../../protocols/cpf-validator'
import { Authentication } from '../../../domain/usecases/authentication/authentication'
import { TransferMoney, TransferModel } from '../../../domain/usecases/transfer-money/transfer-money'
import { TransferMoneyModel } from '../../../domain/models/transfer-money-model'

const validValue = 100

const makeTransferMoney = (): TransferMoney => {
  class TransferMoneyStub implements TransferMoney {
    async transfer (transferMoney: TransferModel): Promise<TransferMoneyModel> {
      const fakeTransfer = {
        name: 'valid_name',
        cpf: 'valid_cpf',
        beneficiaryCpf: 'valid_beneficiary_cpf',
        value: validValue
      }
      return new Promise(resolve => resolve(fakeTransfer))
    }
  }
  return new TransferMoneyStub()
}

const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (cpf: string, password: string): Promise<boolean> {
      return true
    }
  }
  return new AuthenticationStub()
}

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
  authenticationStub: Authentication
  transferMoneyStub: TransferMoney
}

const makeSut = (): SutTypes => {
  const cpfValidatorStub = makeCpfValidator()
  const authenticationStub = makeAuthentication()
  const transferMoneyStub = makeTransferMoney()
  const sut = new TransferController(cpfValidatorStub, authenticationStub, transferMoneyStub)
  return {
    sut,
    cpfValidatorStub,
    authenticationStub,
    transferMoneyStub
  }
}

describe('Transfer Controller', () => {
  test('Should return 400 if no cpf is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        password: 'any_password',
        beneficiaryCpf: 'any_beneficiary_cpf',
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
        beneficiaryCpf: 'any_beneficiary_cpf',
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
        beneficiaryCpf: 'any_beneficiary_cpf'
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
        cpf: 'invalid_cpf',
        password: 'any_password',
        beneficiaryCpf: 'any_beneficiary',
        value: validValue
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('cpf'))
  })

  test('Should return 400 if an invalid beneficiaryCpf is provided ', async () => {
    const { sut, cpfValidatorStub } = makeSut()
    jest.spyOn(cpfValidatorStub, 'isValid').mockReturnValueOnce(true).mockReturnValueOnce(false)
    const httpRequest = {
      body: {
        cpf: 'any_cpf',
        password: 'any_password',
        beneficiaryCpf: 'invalid_beneficiary_cpf',
        value: validValue
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('beneficiaryCpf'))
  })

  test('Should call CpfValidator with correct cpf and correct beneficiaryCpf', async () => {
    const { sut, cpfValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(cpfValidatorStub, 'isValid')
    const httpRequest = {
      body: {
        cpf: 'any_cpf',
        password: 'any_password',
        beneficiaryCpf: 'any_beneficiary_cpf',
        value: validValue
      }
    }
    await sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith('any_cpf')
    expect(isValidSpy).toHaveBeenCalledWith('any_beneficiary_cpf')
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
        beneficiaryCpf: 'any_beneficiary_cpf',
        value: validValue
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Should return 400 if an invalid value is provided ', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        cpf: 'any_cpf',
        password: 'any_password',
        beneficiaryCpf: 'any_beneficiary_cpf',
        value: -100
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('value'))
  })

  test('Should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut()
    const authSpy = jest.spyOn(authenticationStub, 'auth')
    const httpRequest = {
      body: {
        cpf: 'any_cpf',
        password: 'any_password',
        beneficiaryCpf: 'any_beneficiary_cpf',
        value: validValue
      }
    }
    await sut.handle(httpRequest)
    expect(authSpy).toHaveBeenCalledWith('any_cpf', 'any_password')
  })

  test('Should return 401 if invalid credentials are provided', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(new Promise(resolve => resolve(false)))
    const httpRequest = {
      body: {
        cpf: 'invalid_cpf',
        password: 'any_password',
        beneficiaryCpf: 'any_beneficiary_cpf',
        value: validValue
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(401)
    expect(httpResponse.body).toEqual(new UnauthorizedError())
  })

  test('Should return 500 if Authentication throws', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockImplementationOnce(async () => {
      return new Promise((resolve, reject) => reject(new Error()))
    })
    const httpRequest = {
      body: {
        cpf: 'invalid_cpf',
        password: 'any_password',
        beneficiaryCpf: 'any_beneficiary_cpf',
        value: validValue
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Should return 500 if TransferMoney throws', async () => {
    const { sut, transferMoneyStub } = makeSut()
    jest.spyOn(transferMoneyStub, 'transfer').mockImplementationOnce(async () => {
      return new Promise((resolve, reject) => reject(new Error()))
    })
    const httpRequest = {
      body: {
        cpf: 'invalid_cpf',
        password: 'any_password',
        beneficiaryCpf: 'any_beneficiary_cpf',
        value: validValue
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Should call TransferMoney with correct values', async () => {
    const { sut, transferMoneyStub } = makeSut()
    const transferSpy = jest.spyOn(transferMoneyStub, 'transfer')
    const httpRequest = {
      body: {
        cpf: 'valid_cpf',
        password: 'valid_password',
        beneficiaryCpf: 'valid_beneficiary_cpf',
        value: validValue
      }
    }
    await sut.handle(httpRequest)
    expect(transferSpy).toHaveBeenCalledWith({
      cpf: 'valid_cpf',
      password: 'valid_password',
      beneficiaryCpf: 'valid_beneficiary_cpf',
      value: validValue
    })
  })

  test('Should return 400 if TransferMoney returns null', async () => {
    const { sut, transferMoneyStub } = makeSut()
    jest.spyOn(transferMoneyStub, 'transfer').mockReturnValueOnce(null)
    const httpRequest = {
      body: {
        cpf: 'valid_cpf',
        password: 'valid_password',
        beneficiaryCpf: 'valid_beneficiary_cpf',
        value: validValue
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('beneficiaryCpf'))
  })

  test('Should return 400 if TransferMoney returns undefined', async () => {
    const { sut, transferMoneyStub } = makeSut()
    jest.spyOn(transferMoneyStub, 'transfer').mockReturnValueOnce(undefined)
    const httpRequest = {
      body: {
        cpf: 'valid_cpf',
        password: 'valid_password',
        beneficiaryCpf: 'valid_beneficiary_cpf',
        value: validValue
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('value'))
  })

  test('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        cpf: 'valid_cpf',
        password: 'valid_password',
        beneficiaryCpf: 'valid_beneficiary_cpf',
        value: validValue
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({
      name: 'valid_name',
      cpf: 'valid_cpf',
      beneficiaryCpf: 'valid_beneficiary_cpf',
      value: validValue
    })
  })

})
