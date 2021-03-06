import { AlterMoneyAccountRepository } from "../../protocols/db/account/alter-money-account-repository"
import { TransferMoneyModel } from "../../../domain/models/transfer-money-model"
import { DepositModel } from "../../../domain/models/deposit-model"
import { AccountMovimentationHistoryRepository } from "../../protocols/db/account/account-movimentation-history-repository"
import { MovimentationModel } from "../../../domain/models/movimentation-model"
import { WithdrawModel } from "../../../domain/usecases/withdraw/withdraw-money"
import { WithdrawReturnModel } from "../../../domain/models/withdraw-return-model"
import { DbWithdrawMoney } from "./db-withdraw-money"
import { LoadAccountByCpfRepository } from "../../protocols/db/account/load-account-by-cpf-repository"
import { AccountModel } from "../../../domain/models/account-model"

const validValue = 100
const validTaxValue = validValue*0.01
const validAccount = {
  name: 'any_name',
  cpf: 'any_cpf',
  value: validValue-validTaxValue,
  tax: validTaxValue
}
const validWithdrawData = {
  cpf: 'any_cpf',
  password: 'any_password',
  value: validValue
}
const validMovimentationData = {
  cpf: validWithdrawData.cpf,
  type: 'withdraw',
  date: new Date(),
  movimentation: {
    value: validValue
  }
}

const makeAlterMoneyAccountRepository = (): AlterMoneyAccountRepository => {
  class AlterMoneyAccountRepositoryStub implements AlterMoneyAccountRepository {
    deposit (): Promise<DepositModel> { return null }
    transfer (): Promise<TransferMoneyModel> { return null }
    async withdraw (withdrawData: WithdrawModel): Promise<WithdrawReturnModel> {
      return new Promise(resolve => resolve(validAccount))
    }
  }
  return new AlterMoneyAccountRepositoryStub()
}

const makeAccountMovimentationHistoryRepository = (): AccountMovimentationHistoryRepository => {
  class AccountMovimentationHistoryRepositoryStub implements AccountMovimentationHistoryRepository {
    async saveMovimentation (movimentationData: MovimentationModel): Promise<MovimentationModel> {
      return new Promise(resolve => resolve(validMovimentationData))
    }
  }
  return new AccountMovimentationHistoryRepositoryStub()
}

const makeLoadAccountByCpfRepository = (): LoadAccountByCpfRepository => {
  class LoadAccountByCpfRepositoryStub implements LoadAccountByCpfRepository {
    async loadByCpf (cpf: string): Promise<AccountModel> {
      return new Promise(resolve => resolve({
        id: 'any_id',
        name: 'any_name',
        cpf: 'any_cpf',
        password: 'hashed_password',
        money: 100
      }))
    }
  }
  return new LoadAccountByCpfRepositoryStub()
}

interface SutTypes {
  sut: DbWithdrawMoney
  loadAccountByCpfRepositoryStub: LoadAccountByCpfRepository
  alterMoneyAccountRepositoryStub: AlterMoneyAccountRepository
  accountMovimentationHistoryRepositoryStub: AccountMovimentationHistoryRepository
}

const makeSut = (): SutTypes => {
  const loadAccountByCpfRepositoryStub = makeLoadAccountByCpfRepository()
  const alterMoneyAccountRepositoryStub = makeAlterMoneyAccountRepository()
  const accountMovimentationHistoryRepositoryStub = makeAccountMovimentationHistoryRepository()
  const sut = new DbWithdrawMoney(loadAccountByCpfRepositoryStub, alterMoneyAccountRepositoryStub, accountMovimentationHistoryRepositoryStub)
  return {
    sut,
    loadAccountByCpfRepositoryStub,
    alterMoneyAccountRepositoryStub,
    accountMovimentationHistoryRepositoryStub
  }
}

describe('Withdraw Money UseCase', () => {

  test('Should call LoadAccountByCpfRepository with correct cpf', async () => {
    const {sut, loadAccountByCpfRepositoryStub} = makeSut()
    const loadCpfSpy = jest.spyOn(loadAccountByCpfRepositoryStub, 'loadByCpf')
    await sut.withdraw(validWithdrawData)
    expect(loadCpfSpy).toHaveBeenCalledWith('any_cpf')
  })

  test('Should throw if LoadAccountByCpfRepository throws', async () => {
    const { sut, loadAccountByCpfRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByCpfRepositoryStub, 'loadByCpf').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.withdraw(validWithdrawData)
    await expect(promise).rejects.toThrow()
  })

  test('Should return null if money is less then transfer value', async () => {
    const { sut, loadAccountByCpfRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByCpfRepositoryStub, 'loadByCpf').mockReturnValueOnce(new Promise(resolve => resolve({
        id: 'any_cpf',
        name: 'any_name',
        cpf: 'any_cpf',
        password: 'hashed_password',
        money: 50
    })))
    const transfer = await sut.withdraw(validWithdrawData)
    expect(transfer).toBeNull()
  })

  test('Should call AlterMoneyAccountRepository withdraw with correct values', async () => {
    const {sut, alterMoneyAccountRepositoryStub} = makeSut()
    const withdrawSpy = jest.spyOn(alterMoneyAccountRepositoryStub, 'withdraw')
    await sut.withdraw(validWithdrawData)
    expect(withdrawSpy).toHaveBeenCalledWith(validWithdrawData)
  })

  test('Should throw if AlterMoneyAccountRepository throws', async () => {
    const { sut, alterMoneyAccountRepositoryStub } = makeSut()
    jest.spyOn(alterMoneyAccountRepositoryStub, 'withdraw').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.withdraw(validWithdrawData)
    await expect(promise).rejects.toThrow()
  })

  test('Should call AccountMovimentationHistoryRepository saveMovimentation with correct values', async () => {
    const {sut, accountMovimentationHistoryRepositoryStub} = makeSut()
    const saveSpy = jest.spyOn(accountMovimentationHistoryRepositoryStub, 'saveMovimentation')
    const date = new Date()
    await sut.withdraw(validWithdrawData)
    expect(saveSpy).toHaveBeenCalledWith({
      cpf: validWithdrawData.cpf,
      type: 'withdraw',
      date: date,
      movimentation: {
        value: validWithdrawData.value
      }
    })
  })

  test('Should throw if AccountMovimentationHistoryRepository saveMovimentation throws', async () => {
    const { sut, accountMovimentationHistoryRepositoryStub } = makeSut()
    jest.spyOn(accountMovimentationHistoryRepositoryStub, 'saveMovimentation').mockImplementationOnce(() => {
      throw new Error()
    })
    const promise = sut.withdraw(validWithdrawData)
    await expect(promise).rejects.toThrow()
  })

  test('Should return an withdraw on success', async () => {
    const { sut } = makeSut()
    const account = await sut.withdraw(validWithdrawData)
    expect(account).toEqual(validAccount)
  })

})