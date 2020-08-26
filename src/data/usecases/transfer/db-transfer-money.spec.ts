import { LoadAccountByCpfRepository } from "../../protocols/db/account/load-account-by-cpf-repository"
import { AccountModel } from "../../../domain/models/account-model"
import { DbTransferMoney } from "./db-transfer-money"
import { AlterMoneyAccountRepository } from "../../protocols/db/account/alter-money-account-repository"
import { DepositModel } from "../../../domain/models/deposit-model"
import { TransferMoneyModel } from "../../../domain/models/transfer-money-model"
import { TransferModel } from "../../../domain/usecases/transfer-money/transfer-money"

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

const makeAlterMoneyAccountRepository = (): AlterMoneyAccountRepository => {
  class AlterMoneyAccountRepositoryStub implements AlterMoneyAccountRepository {
    async deposit (): Promise<DepositModel> {
      return new Promise(resolve => resolve(null))
    }
    async transfer (transferMoney: TransferModel): Promise<TransferMoneyModel> {
      return new Promise(resolve => resolve({
        name: 'any_name',
        cpf: 'any_cpf',
        beneficiaryCpf: 'any_beneficiary_cpf',
        value: 100
      }))
    }
  }
  return new AlterMoneyAccountRepositoryStub()
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
  alterMoneyAccountRepositoryStub: AlterMoneyAccountRepository
}

const makeSut = (): SutTypes => {
  const loadAccountByCpfRepositoryStub = makeLoadAccountByCpfRepository()
  const alterMoneyAccountRepositoryStub = makeAlterMoneyAccountRepository()
  const sut = new DbTransferMoney(loadAccountByCpfRepositoryStub, alterMoneyAccountRepositoryStub)
  return {
    sut,
    loadAccountByCpfRepositoryStub,
    alterMoneyAccountRepositoryStub
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

test('Should call AlterMoneyAccountRepository deposit with correct values', async () => {
  const {sut, alterMoneyAccountRepositoryStub} = makeSut()
  const depositSpy = jest.spyOn(alterMoneyAccountRepositoryStub, 'transfer')
  await sut.transfer(transferData)
  expect(depositSpy).toHaveBeenCalledWith(transferData)
})