import { AccountModel } from "../../../domain/models/account-model"
import { LoadAccountByCpfRepository } from "../../protocols/load-account-by-cpf-repository"
import { DbAuthentication } from "./db-authentication"

describe('DbAddAccount Usecase', () => {

  test('Should call LoadAccountByCpfRepository with correct cpf', async () => {
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
    const loadAccountByCpfRepositoryStub = new LoadAccountByCpfRepositoryStub()
    const sut = new DbAuthentication(loadAccountByCpfRepositoryStub)
    const loadSpy = jest.spyOn(loadAccountByCpfRepositoryStub, 'load')
    await sut.auth('any_cpf', 'any_password')
    expect(loadSpy).toHaveBeenCalledWith('any_cpf')
  })

})
