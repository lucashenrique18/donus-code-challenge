import { AccountModel } from "../../../domain/models/account-model"
import { DepositModel } from "../../../domain/models/deposit-model"
import { MovimentationModel } from "../../../domain/models/movimentation-model"
import { LoadAccountByCpfRepository, DbTransferMoney, AlterMoneyAccountRepository, TransferMoneyModel, TransferModel, AccountMovimentationHistoryRepository } from './db-transfer-money-protocol'
import { WithdrawReturnModel } from "../../../domain/models/withdraw-return-model"

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
  money: 100
}

const validMovimentationData = {
  cpf: transferData.cpf,
  type: 'transfer',
  date: new Date(),
  movimentation: {
    value: transferData.value,
    beneficiary: transferData.beneficiaryCpf
  }
}

const makeAccountMovimentationHistoryRepository = (): AccountMovimentationHistoryRepository => {
  class AccountMovimentationHistoryRepositoryStub implements AccountMovimentationHistoryRepository {
    async saveMovimentation (movimentationData: MovimentationModel): Promise<MovimentationModel> {
      return new Promise(resolve => resolve(validMovimentationData))
    }
  }
  return new AccountMovimentationHistoryRepositoryStub()
}

const makeAlterMoneyAccountRepository = (): AlterMoneyAccountRepository => {
  class AlterMoneyAccountRepositoryStub implements AlterMoneyAccountRepository {
    deposit (): Promise<DepositModel> { return null }
    async transfer (transferMoney: TransferModel): Promise<TransferMoneyModel> {
      return new Promise(resolve => resolve({
        name: 'any_name',
        cpf: 'any_cpf',
        beneficiaryCpf: 'any_beneficiary_cpf',
        value: 100
      }))
    }
    withdraw (): Promise<WithdrawReturnModel> { return null }
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
  accountMovimentationHistoryRepositoryStub: AccountMovimentationHistoryRepository
}

const makeSut = (): SutTypes => {
  const loadAccountByCpfRepositoryStub = makeLoadAccountByCpfRepository()
  const alterMoneyAccountRepositoryStub = makeAlterMoneyAccountRepository()
  const accountMovimentationHistoryRepositoryStub = makeAccountMovimentationHistoryRepository()
  const sut = new DbTransferMoney(loadAccountByCpfRepositoryStub, alterMoneyAccountRepositoryStub, accountMovimentationHistoryRepositoryStub)
  return {
    sut,
    loadAccountByCpfRepositoryStub,
    alterMoneyAccountRepositoryStub,
    accountMovimentationHistoryRepositoryStub
  }
}

describe('Db Transfer Money', () => {
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
    jest.spyOn(loadAccountByCpfRepositoryStub, 'loadByCpf').mockReturnValueOnce(new Promise(resolve => resolve({
        id: 'valid_id',
        name: 'valid_name',
        cpf: 'valid_cpf',
        password: 'hashed_password',
        money: 50
    })))
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
    const transferSpy = jest.spyOn(alterMoneyAccountRepositoryStub, 'transfer')
    await sut.transfer(transferData)
    expect(transferSpy).toHaveBeenCalledWith(transferData)
  })

  test('Should throw if AlterMoneyAccountRepository throws', async () => {
    const { sut, alterMoneyAccountRepositoryStub } = makeSut()
    jest.spyOn(alterMoneyAccountRepositoryStub, 'transfer').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.transfer(transferData)
    await expect(promise).rejects.toThrow()
  })

  test('Should call AccountMovimentationHistoryRepository saveMovimentation with correct values', async () => {
    const {sut, accountMovimentationHistoryRepositoryStub} = makeSut()
    const saveSpy = jest.spyOn(accountMovimentationHistoryRepositoryStub, 'saveMovimentation')
    const date = new Date()
    await sut.transfer(transferData)
    expect(saveSpy).toHaveBeenCalledWith({
      cpf: transferData.cpf,
      type: 'transfer',
      date: date,
      movimentation: {
        value: transferData.value,
        beneficiary: transferData.beneficiaryCpf
      }
    })
  })

  test('Should throw if AccountMovimentationHistoryRepository saveMovimentation throws', async () => {
    const { sut, accountMovimentationHistoryRepositoryStub } = makeSut()
    jest.spyOn(accountMovimentationHistoryRepositoryStub, 'saveMovimentation').mockImplementationOnce(() => {
      throw new Error()
    })
    const promise = sut.transfer(transferData)
    await expect(promise).rejects.toThrow()
  })

  test('Should return an transfer on success', async () => {
    const { sut } = makeSut()
    const account = await sut.transfer(transferData)
    expect(account).toEqual({
      name: 'any_name',
      cpf: 'any_cpf',
      beneficiaryCpf: 'any_beneficiary_cpf',
      value: 100
    })
  })


})





