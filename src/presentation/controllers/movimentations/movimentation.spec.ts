import { MovimentationController, CpfValidator, Authentication, LoadMovimentation, MovimentationModel } from './movimentation-protocol'
import { MissingParamError, InvalidParamError, ServerError, UnauthorizedError } from '../../errors'

const fakeMovimentation = {
  cpf: 'any_cpf',
  type: 'any_type',
  date: new Date(),
  movimentation: {
    value: 100
  }
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

const makeLoadMovimentation = (): LoadMovimentation => {
  class LoadMovimentationStub implements LoadMovimentation {
    async load (cpf: string): Promise<Array<MovimentationModel>> {
      return new Promise(resolve => resolve([fakeMovimentation]))
    }
  }
  return new LoadMovimentationStub()
}

interface SutTypes {
  sut: MovimentationController
  cpfValidatorStub: CpfValidator
  authenticationStub: Authentication
  loadMovimentationStub: LoadMovimentation
}

const makeSut = (): SutTypes => {
  const cpfValidatorStub = makeCpfValidator()
  const authenticationStub = makeAuthentication()
  const loadMovimentationStub = makeLoadMovimentation()
  const sut = new MovimentationController(cpfValidatorStub, authenticationStub, loadMovimentationStub)
  return {
    sut,
    cpfValidatorStub,
    authenticationStub,
    loadMovimentationStub
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

  test('Should call LoadMovimentation with correct values', async () => {
    const { sut, loadMovimentationStub } = makeSut()
    const loadSpy = jest.spyOn(loadMovimentationStub, 'load')
    const httpRequest = {
      body: {
        cpf: 'any_cpf',
        password: 'any_password'
      }
    }
    await sut.handle(httpRequest)
    expect(loadSpy).toHaveBeenCalledWith('any_cpf')
  })

  test('Should return 500 if LoadMovimentation throws', async () => {
    const { sut, loadMovimentationStub } = makeSut()
    jest.spyOn(loadMovimentationStub, 'load').mockImplementationOnce(async () => {
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

  test('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        cpf: 'any_cpf',
        password: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body[0]).toEqual(fakeMovimentation)
  })

})
