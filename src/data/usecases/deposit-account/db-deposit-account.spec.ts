import { DepositAccount } from './db-deposit-account'
import { DepositModel } from "../../../domain/models/deposit-model"
import { AlterMoneyAccountRepository } from "../../protocols/db/account/alter-money-account-repository";
import { AccountMovimentationHistoryRepository } from "../../protocols/db/account/account-movimentation-history-repository";
import { DepositAmountModel } from '../../../domain/usecases/deposit-amount/deposit-amount'
import { MovimentationModel } from '../../../domain/models/movimentation-model';

const validDeposit = 100
const depositWithBonus = validDeposit+(validDeposit*0.05)
const validAccount = {
  name: 'any_name',
  cpf: 'any_cpf',
  depositValue: depositWithBonus
}
const validDepositData = {
  cpf: 'any_cpf',
  password: 'any_password',
  depositValue: validDeposit
}
const validMovimentationData = {
  cpf: validDepositData.cpf,
  type: 'deposit',
  date: new Date(),
  movimentation: {
    value: validDepositData.depositValue
  }
}

const makeAlterMoneyAccountRepository = (): AlterMoneyAccountRepository => {
  class AlterMoneyAccountRepositoryStub implements AlterMoneyAccountRepository {
    async deposit (deposit: DepositAmountModel): Promise<DepositModel> {
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

interface SutTypes {
  sut: DepositAccount
  alterMoneyAccountRepositoryStub: AlterMoneyAccountRepository
  accountMovimentationHistoryRepositoryStub: AccountMovimentationHistoryRepository
}

const makeSut = (): SutTypes => {
  const alterMoneyAccountRepositoryStub = makeAlterMoneyAccountRepository()
  const accountMovimentationHistoryRepositoryStub = makeAccountMovimentationHistoryRepository()
  const sut = new DepositAccount(alterMoneyAccountRepositoryStub, accountMovimentationHistoryRepositoryStub)
  return {
    sut,
    alterMoneyAccountRepositoryStub,
    accountMovimentationHistoryRepositoryStub
  }
}


describe('Deposit Account UseCase', () => {

  test('Should call AlterMoneyAccountRepository deposit with correct values', async () => {
    const {sut, alterMoneyAccountRepositoryStub} = makeSut()
    const depositSpy = jest.spyOn(alterMoneyAccountRepositoryStub, 'deposit')
    await sut.deposit(validDepositData)
    expect(depositSpy).toHaveBeenCalledWith({
      cpf: 'any_cpf',
      password: 'any_password',
      depositValue: depositWithBonus
    })
  })

  test('Should throw if AlterMoneyAccountRepository throws', async () => {
    const { sut, alterMoneyAccountRepositoryStub } = makeSut()
    jest.spyOn(alterMoneyAccountRepositoryStub, 'deposit').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.deposit(validDepositData)
    await expect(promise).rejects.toThrow()
  })

  test('Should call AccountMovimentationHistoryRepository saveMovimentation with correct values', async () => {
    const {sut, accountMovimentationHistoryRepositoryStub} = makeSut()
    const saveSpy = jest.spyOn(accountMovimentationHistoryRepositoryStub, 'saveMovimentation')
    await sut.deposit(validDepositData)
    expect(saveSpy).toHaveBeenCalledWith({
      cpf: validDepositData.cpf,
      type: 'deposit',
      date: new Date(),
      movimentation: {
        value: validDepositData.depositValue
      }
    })
  })

  test('Should throw if AccountMovimentationHistoryRepository saveMovimentation throws', async () => {
    const { sut, accountMovimentationHistoryRepositoryStub } = makeSut()
    jest.spyOn(accountMovimentationHistoryRepositoryStub, 'saveMovimentation').mockImplementationOnce(() => {
      throw new Error()
    })
    const promise = sut.deposit(validDepositData)
    await expect(promise).rejects.toThrow()
  })

  test('Should return an account on success', async () => {
    const { sut } = makeSut()
    const account = await sut.deposit(validDepositData)
    expect(account).toEqual(validAccount)
  })

})

