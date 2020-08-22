import { DbAddAccount  } from './db-add-account'
import { Encrypter, AddAccountModel, AddAccountRepository, AccountModel, LoadAccountByCpfRepository } from './db-add-account-protocols'

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return new Promise(resolve => resolve('hashed_password'))
    }
  }
  return new EncrypterStub()
}

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (accountData: AddAccountModel): Promise<AccountModel> {
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
  return new AddAccountRepositoryStub()
}

const makeLoadAccountByCpfRepository = (): LoadAccountByCpfRepository => {
  class LoadAccountByCpfRepositoryStub implements LoadAccountByCpfRepository {
    async loadByCpf (cpf: string): Promise<AccountModel> {
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
  sut: DbAddAccount
  encrypterStub: Encrypter
  addAccountRepositoryStub: AddAccountRepository
  loadAccountByCpfRepositoryStub: LoadAccountByCpfRepository
}

const makeSut = (): SutTypes => {
  const loadAccountByCpfRepositoryStub = makeLoadAccountByCpfRepository()
  const encrypterStub = makeEncrypter()
  const addAccountRepositoryStub = makeAddAccountRepository()
  const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub, loadAccountByCpfRepositoryStub)
  return {
    sut,
    encrypterStub,
    addAccountRepositoryStub,
    loadAccountByCpfRepositoryStub
  }
}

describe('DbAddAccount Usecase', () => {
  test('Should call Encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    const accountData = {
      name: 'valid_name',
      cpf: 'valid_cpf',
      password: 'valid_password'
    }
    await sut.add(accountData)
    expect(encryptSpy).toHaveBeenCalledWith('valid_password')
  })

  test('Should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const accountData = {
      name: 'valid_name',
      cpf: 'valid_cpf',
      password: 'valid_password'
    }
    const promise = sut.add(accountData)
    await expect(promise).rejects.toThrow()
  })

  test('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
    const accountData = {
      name: 'valid_name',
      cpf: 'valid_cpf',
      password: 'valid_password'
    }
    await sut.add(accountData)
    expect(addSpy).toHaveBeenCalledWith({
      name: 'valid_name',
      cpf: 'valid_cpf',
      password: 'hashed_password',
      money: 0
    })
  })

  test('Should throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    jest.spyOn(addAccountRepositoryStub, 'add').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const accountData = {
      name: 'valid_name',
      cpf: 'valid_cpf',
      password: 'valid_password'
    }
    const promise = sut.add(accountData)
    await expect(promise).rejects.toThrow()
  })

  test('Should return an account on success', async () => {
    const { sut } = makeSut()
    const accountData = {
      name: 'valid_name',
      cpf: 'valid_cpf',
      password: 'valid_password'
    }
    const account = await sut.add(accountData)
    expect(account).toEqual({
      id: 'valid_id',
      name: 'valid_name',
      cpf: 'valid_cpf',
      password: 'hashed_password',
      money: 0
    })
  })

  test('Should call LoadAccountByCpfRepository with correct cpf', async () => {
    const {sut, loadAccountByCpfRepositoryStub} = makeSut()
    const loadSpy = jest.spyOn(loadAccountByCpfRepositoryStub, 'loadByCpf')
    const accountData = {
      name: 'valid_name',
      cpf: 'valid_cpf',
      password: 'valid_password'
    }
    await sut.add(accountData)
    expect(loadSpy).toHaveBeenCalledWith('valid_cpf')
  })

})
