import { DbMovimentation } from './db-movimentation'
import { AccountMovimentationHistoryRepository } from "../../protocols/db/account/account-movimentation-history-repository"
import { MovimentationModel } from "../../../domain/models/movimentation-model"
import { LoadMovimentationsModel } from "../../../domain/usecases/movimentation/movimentation"

const validMovimentationData = {
  cpf: 'any_cpf',
  type: 'deposit',
  date: new Date(),
  movimentation: {
    value: 100
  }
}

const makeAccountMovimentationHistoryRepository = (): AccountMovimentationHistoryRepository => {
  class AccountMovimentationHistoryRepositoryStub implements AccountMovimentationHistoryRepository {
    async loadMovimentations (cpf: string): Promise<MovimentationModel> {
      return new Promise(resolve => resolve(validMovimentationData))
    }
    async saveMovimentation (): Promise<MovimentationModel> {
      return new Promise(resolve => resolve(null))
    }
  }
  return new AccountMovimentationHistoryRepositoryStub()
}

interface SutTypes {
  sut: DbMovimentation
  accountMovimentationHistoryRepositoryStub: AccountMovimentationHistoryRepository
}

const makeSut = (): SutTypes => {
  const accountMovimentationHistoryRepositoryStub = makeAccountMovimentationHistoryRepository()
  const sut = new DbMovimentation(accountMovimentationHistoryRepositoryStub)
  return {
    sut,
    accountMovimentationHistoryRepositoryStub
  }
}

describe('Deposit Account UseCase', () => {
  test('Should call AccountMovimentationHistoryRepository loadMovimentations with correct value', async () => {
    const {sut, accountMovimentationHistoryRepositoryStub} = makeSut()
    const loadSpy = jest.spyOn(accountMovimentationHistoryRepositoryStub, 'loadMovimentations')
    await sut.load('any_cpf')
    expect(loadSpy).toHaveBeenCalledWith('any_cpf')
  })

  test('Should throw if AccountMovimentationHistoryRepository throws', async () => {
    const { sut, accountMovimentationHistoryRepositoryStub } = makeSut()
    jest.spyOn(accountMovimentationHistoryRepositoryStub, 'loadMovimentations').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.load('any_cpf')
    await expect(promise).rejects.toThrow()
  })

  test('Should return an movimentations on success', async () => {
    const { sut } = makeSut()
    const movimentations = await sut.load('any_cpf')
    expect(movimentations).toEqual(validMovimentationData)
  })

})