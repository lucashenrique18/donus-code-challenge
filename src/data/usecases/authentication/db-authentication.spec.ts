
import { DbAuthentication } from "./db-authentication"
import { AccountModel, LoadAccountByCpfRepository, HashComparer} from './db-authentication-protocols'

const makeHashComparer = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare (value: string, hash: string): Promise<boolean> {
      return new Promise(resolve => resolve(true))
    }
  }
  return new HashComparerStub()
}

const makeLoadAccountByCpfRepository = (): LoadAccountByCpfRepository => {
  class LoadAccountByCpfRepositoryStub implements LoadAccountByCpfRepository {
    async load (cpf: string): Promise<AccountModel> {
      const fakeAccount = {
        id: 'valid_id',
        name: 'valid_name',
        cpf: 'valid_cpf',
        password: 'hashed_password',
        money: 0
      }
      return new Promise(resolve => resolve(fakeAccount))
    }
  }
  return new LoadAccountByCpfRepositoryStub()
}

interface SutTypes {
  sut: DbAuthentication
  loadAccountByCpfRepositoryStub: LoadAccountByCpfRepository
  hashComparerStub: HashComparer
}

const makeSut = (): SutTypes => {
  const loadAccountByCpfRepositoryStub = makeLoadAccountByCpfRepository()
  const hashComparerStub = makeHashComparer()
  const sut = new DbAuthentication(loadAccountByCpfRepositoryStub, hashComparerStub)
  return {
    sut,
    loadAccountByCpfRepositoryStub,
    hashComparerStub
  }
}

describe('Db Authentication Usecase', () => {

  test('Should call LoadAccountByCpfRepository with correct cpf', async () => {
    const {sut, loadAccountByCpfRepositoryStub} = makeSut()
    const loadSpy = jest.spyOn(loadAccountByCpfRepositoryStub, 'load')
    await sut.auth('any_cpf', 'hashed_password')
    expect(loadSpy).toHaveBeenCalledWith('any_cpf')
  })

  test('Should throw if LoadAccountByCpfRepository throws', async () => {
    const { sut, loadAccountByCpfRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByCpfRepositoryStub, 'load').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.auth('any_cpf', 'any_password')
    await expect(promise).rejects.toThrow()
  })

  test('Should return null if LoadAccountByCpfRepository returns null', async () => {
    const {sut, loadAccountByCpfRepositoryStub} = makeSut()
    jest.spyOn(loadAccountByCpfRepositoryStub, 'load').mockReturnValueOnce(null)
    const accountExists = await sut.auth('any_cpf', 'any_password')
    expect(accountExists).toBeFalsy()
  })

  test('Should call HashComparer with correct values', async () => {
    const {sut, hashComparerStub} = makeSut()
    const compareSpy = jest.spyOn(hashComparerStub, 'compare')
    await sut.auth('any_cpf', 'any_password')
    expect(compareSpy).toHaveBeenCalledWith('any_password', 'hashed_password')
  })

  test('Should throw if HashComparer throws', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.auth('any_cpf', 'any_password')
    await expect(promise).rejects.toThrow()
  })

  test('Should return null if LoadAccountByCpfRepository returns false', async () => {
    const {sut, hashComparerStub} = makeSut()
    jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(new Promise(resolve => resolve(false)))
    const accountExists = await sut.auth('any_cpf', 'any_password')
    expect(accountExists).toBeFalsy()
  })

  test('Should return true if DbAuthentication returns true', async () => {
    const {sut,} = makeSut()
    const accountExists = await sut.auth('any_cpf', 'any_password')
    expect(accountExists).toBeTruthy()
  })

})
