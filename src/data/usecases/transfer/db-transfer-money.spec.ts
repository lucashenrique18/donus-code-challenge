import { LoadAccountByCpfRepository } from "../../protocols/db/account/load-account-by-cpf-repository"
import { AccountModel } from "../../../domain/models/account-model"
import { DbTransferMoney } from "./db-transfer-money"

const transferData = {
  cpf: 'valid_cpf',
  password: 'valid_password',
  beneficiaryCpf: 'valid_cpf_beneficiary',
  value: 100
}

const validAccout = {
  id: 'valid_id',
  name: 'valid_name',
  cpf: 'valid_cpf',
  password: 'hashed_password',
  money: 1000
}

const makeLoadAccountByCpfRepository = (): LoadAccountByCpfRepository => {
  class LoadAccountByCpfRepositoryStub implements LoadAccountByCpfRepository {
    async loadByCpf (cpf: string): Promise<AccountModel> {
      return new Promise(resolve => resolve(validAccout))
    }
  }
  return new LoadAccountByCpfRepositoryStub()
}

interface SutTypes {
  sut: DbTransferMoney
  loadAccountByCpfRepositoryStub: LoadAccountByCpfRepository
}

const makeSut = (): SutTypes => {
  const loadAccountByCpfRepositoryStub = makeLoadAccountByCpfRepository()
  const sut = new DbTransferMoney(loadAccountByCpfRepositoryStub)
  return {
    sut,
    loadAccountByCpfRepositoryStub
  }
}

test('Should call LoadAccountByCpfRepository with correct cpf', async () => {
  const {sut, loadAccountByCpfRepositoryStub} = makeSut()
  const loadCpfSpy = jest.spyOn(loadAccountByCpfRepositoryStub, 'loadByCpf')
  await sut.transfer(transferData)
  expect(loadCpfSpy).toHaveBeenCalledWith('valid_cpf')
})

test('Should throw if LoadAccountByCpfRepository throws', async () => {
  const { sut, loadAccountByCpfRepositoryStub } = makeSut()
  jest.spyOn(loadAccountByCpfRepositoryStub, 'loadByCpf').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
  const promise = sut.transfer(transferData)
  await expect(promise).rejects.toThrow()
})

test('Should return null if money is less then transfer value', async () => {
  const { sut, loadAccountByCpfRepositoryStub } = makeSut()
  jest.spyOn(loadAccountByCpfRepositoryStub, 'loadByCpf').mockReturnValueOnce(new Promise(resolve => resolve(validAccout)))
  const transfer = await sut.transfer(transferData)
  expect(transfer).toBeNull()
})

test('Should return undefined if beneficiary not exists', async () => {
  const { sut, loadAccountByCpfRepositoryStub } = makeSut()
  jest.spyOn(loadAccountByCpfRepositoryStub, 'loadByCpf').mockReturnValueOnce(new Promise(resolve => resolve(validAccout))).mockReturnValueOnce(new Promise(resolve => resolve(null)))
  const transfer = await sut.transfer(transferData)
  expect(transfer).toBeUndefined()
})
