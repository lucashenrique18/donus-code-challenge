import { DepositAccount } from './deposit-account'
import { DepositModel } from "../../../domain/models/deposit-model"
import { AlterMoneyAccountRepository } from "../../protocols/alter-money-account-repository"

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

const makeAlterMoneyAccountRepository = (): AlterMoneyAccountRepository => {
  class AlterMoneyAccountRepositoryStub implements AlterMoneyAccountRepository {
    async deposit (depositValue: number): Promise<DepositModel> {
      return new Promise(resolve => resolve(validAccount))
    }
  }
  return new AlterMoneyAccountRepositoryStub()
}

interface SutTypes {
  sut: DepositAccount
  alterMoneyAccountRepositoryStub: AlterMoneyAccountRepository
}

const makeSut = (): SutTypes => {
  const alterMoneyAccountRepositoryStub = makeAlterMoneyAccountRepository()
  const sut = new DepositAccount(alterMoneyAccountRepositoryStub)
  return {
    sut,
    alterMoneyAccountRepositoryStub
  }
}


describe('Deposit Account UseCase', () => {

  test('Should call AlterMoneyAccountRepository deposit with correct values', async () => {
    const {sut, alterMoneyAccountRepositoryStub} = makeSut()
    const loadSpy = jest.spyOn(alterMoneyAccountRepositoryStub, 'deposit')
    await sut.deposit(validDepositData)
    expect(loadSpy).toHaveBeenCalledWith(validAccount.depositValue)
  })

  test('Should throw if AlterMoneyAccountRepository throws', async () => {
    const { sut, alterMoneyAccountRepositoryStub } = makeSut()
    jest.spyOn(alterMoneyAccountRepositoryStub, 'deposit').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.deposit(validDepositData)
    await expect(promise).rejects.toThrow()
  })

  test('Should return an account on success', async () => {
    const { sut } = makeSut()
    const account = await sut.deposit(validDepositData)
    expect(account).toEqual(validAccount)
  })

})

