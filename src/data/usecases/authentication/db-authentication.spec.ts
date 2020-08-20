import { AccountModel } from "../../../domain/models/account-model"
import { LoadAccountByCpfRepository } from "../../protocols/load-account-by-cpf-repository"
import { DbAuthentication } from "./db-authentication"

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
}

const makeSut = (): SutTypes => {
  const loadAccountByCpfRepositoryStub = makeLoadAccountByCpfRepository()
  const sut = new DbAuthentication(loadAccountByCpfRepositoryStub)
  return {
    sut,
    loadAccountByCpfRepositoryStub
  }
}

describe('DbAddAccount Usecase', () => {

  test('Should call LoadAccountByCpfRepository with correct cpf', async () => {
    const {sut, loadAccountByCpfRepositoryStub} = makeSut()
    const loadSpy = jest.spyOn(loadAccountByCpfRepositoryStub, 'load')
    await sut.auth('any_cpf', 'any_password')
    expect(loadSpy).toHaveBeenCalledWith('any_cpf')
  })

})
