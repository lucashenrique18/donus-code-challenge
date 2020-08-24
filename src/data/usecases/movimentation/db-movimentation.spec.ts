import { DbMovimentation } from './db-movimentation'
import { LoadMovimentationRepository, LoadMovimentationModel } from '../../protocols/db/account/load-movimentations-repository'

const validMovimentationData = {
  cpf: 'any_cpf',
  type: 'deposit',
  date: new Date(),
  movimentation: {
    value: 100
  }
}

const makeLoadMovimentationRepository = (): LoadMovimentationRepository => {
  class LoadMovimentationRepositoryStub implements LoadMovimentationRepository {
    async loadMovimentations (cpf: string): Promise<Array<LoadMovimentationModel>> {
      return new Promise(resolve => resolve([validMovimentationData]))
    }
  }
  return new LoadMovimentationRepositoryStub()
}

interface SutTypes {
  sut: DbMovimentation
  loadMovimentationRepositoryStub: LoadMovimentationRepository
}

const makeSut = (): SutTypes => {
  const loadMovimentationRepositoryStub = makeLoadMovimentationRepository()
  const sut = new DbMovimentation(loadMovimentationRepositoryStub)
  return {
    sut,
    loadMovimentationRepositoryStub
  }
}

describe('Deposit Account UseCase', () => {
  test('Should call AccountMovimentationHistoryRepository loadMovimentations with correct value', async () => {
    const {sut, loadMovimentationRepositoryStub} = makeSut()
    const loadSpy = jest.spyOn(loadMovimentationRepositoryStub, 'loadMovimentations')
    await sut.load('any_cpf')
    expect(loadSpy).toHaveBeenCalledWith('any_cpf')
  })

  test('Should throw if AccountMovimentationHistoryRepository throws', async () => {
    const { sut, loadMovimentationRepositoryStub } = makeSut()
    jest.spyOn(loadMovimentationRepositoryStub, 'loadMovimentations').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.load('any_cpf')
    await expect(promise).rejects.toThrow()
  })

  test('Should return an movimentations on success', async () => {
    const { sut } = makeSut()
    const movimentations = await sut.load('any_cpf')
    expect(movimentations[0]).toEqual(validMovimentationData)
  })

})