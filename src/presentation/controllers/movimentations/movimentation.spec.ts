import { MovimentationController } from './movimentation'
import { MissingParamError, InvalidParamError, ServerError, UnauthorizedError } from '../../errors'
import { CpfValidator } from '../../protocols/cpf-validator'
import { Authentication } from '../../../domain/usecases/authentication/authentication'

interface SutTypes {
  sut: MovimentationController
  cpfValidatorStub: CpfValidator
  authenticationStub: Authentication
}

const makeCpfValidator = (): CpfValidator => {
  class CpfValidatorStub implements CpfValidator {
    isValid (cpf: string): boolean {
      return true
    }
  }
  return new CpfValidatorStub()
}

const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (cpf: string, password: string): Promise<boolean> {
      return true
    }
  }
  return new AuthenticationStub()
}

const makeSut = (): SutTypes => {
  const cpfValidatorStub = makeCpfValidator()
  const authenticationStub = makeAuthentication()
  const sut = new MovimentationController(cpfValidatorStub, authenticationStub)
  return {
    sut,
    cpfValidatorStub,
    authenticationStub
  }
}

describe('Movimentation Controller', () => {
  test('Should return 400 if no cpf is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        password: 'any_password'
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
        cpf: 'any_cpf'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  test('Should return 400 if an invalid cpf is provided ', async () => {
    const { sut, cpfValidatorStub } = makeSut()
    jest.spyOn(cpfValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpRequest = {
      body: {
        cpf: 'invalid_cpf',
        password: 'any_password'
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
        password: 'any_password'
      }
    }
    await sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith('any_cpf')
  })

  test('Should return 500 if CpfValidator throws', async () => {
    const { sut, cpfValidatorStub } = makeSut()
    jest.spyOn(cpfValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpRequest = {
      body: {
        cpf: 'any_cpf',
        password: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut()
    const authSpy = jest.spyOn(authenticationStub, 'auth')
    const httpRequest = {
      body: {
        cpf: 'any_cpf',
        password: 'any_password'
      }
    }
    await sut.handle(httpRequest)
    expect(authSpy).toHaveBeenCalledWith('any_cpf', 'any_password')
  })

  test('Should return 500 if Authentication throws', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockImplementationOnce(async () => {
      return new Promise((resolve, reject) => reject(new Error()))
    })
    const httpRequest = {
      body: {
        cpf: 'any_cpf',
        password: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Should return 401 if invalid credentials are provided', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(new Promise(resolve => resolve(false)))
    const httpRequest = {
      body: {
        cpf: 'any_cpf',
        password: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(401)
    expect(httpResponse.body).toEqual(new UnauthorizedError())
  })

})
