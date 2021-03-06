import { AddAccountRepository } from '../../../../data/protocols/db/account/add-account-repository'
import { AddAccountModel } from '../../../../domain/usecases/add-account/add-account'
import { AccountModel } from '../../../../domain/models/account-model'
import { MongoHelper } from '../helpers/mongo-helper'
import { LoadAccountByCpfRepository } from '../../../../data/protocols/db/account/load-account-by-cpf-repository'
import { AlterMoneyAccountRepository } from '../../../../data/protocols/db/account/alter-money-account-repository'
import { DepositAmountModel } from '../../../../domain/usecases/deposit-amount/deposit-amount'
import { DepositModel } from '../../../../domain/models/deposit-model'
import { MovimentationModel } from '../../../../domain/models/movimentation-model'
import { AccountMovimentationHistoryRepository } from '../../../../data/protocols/db/account/account-movimentation-history-repository'
import { TransferMoneyModel } from '../../../../domain/models/transfer-money-model'
import { TransferModel } from '../../../../domain/usecases/transfer-money/transfer-money'
import { WithdrawReturnModel } from '../../../../domain/models/withdraw-return-model'
import { WithdrawModel } from '../../../../domain/usecases/withdraw/withdraw-money'

export class AccountMongoRepository implements AddAccountRepository, LoadAccountByCpfRepository, AlterMoneyAccountRepository, AccountMovimentationHistoryRepository {

  async add (accountData: AddAccountModel): Promise<AccountModel>{
    const accountCollection = await MongoHelper.getCollection('accounts')
    const result = await accountCollection.insertOne(accountData)
    const account = MongoHelper.map(result.ops[0])
    return new Promise(resolve => resolve(account))
  }

  async loadByCpf (cpf: string): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const account = await accountCollection.findOne({cpf})
    return new Promise(resolve => resolve(account && MongoHelper.map(account)))
  }

  async deposit (depositData: DepositAmountModel): Promise<DepositModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.updateOne({cpf: depositData.cpf}, {$inc: {money: depositData.depositValue}})
    const account = await accountCollection.findOne({cpf: depositData.cpf})
    return new Promise(resolve => resolve({
      name: account.name,
      cpf: account.cpf,
      depositValue: depositData.depositValue
    }))
  }

  async saveMovimentation (movimentationData: MovimentationModel): Promise<MovimentationModel> {
    const accountCollection = await MongoHelper.getCollection('movimentations')
    const result = await accountCollection.insertOne(movimentationData)
    const { cpf, type, movimentation, date } = result.ops[0]
    return new Promise(resolve => resolve({
      cpf,
      type,
      movimentation,
      date
    }))
  }

  async transfer (transferMoney: TransferModel): Promise<TransferMoneyModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.updateOne({cpf: transferMoney.cpf}, {$inc: {money: -transferMoney.value}})
    await accountCollection.updateOne({cpf: transferMoney.beneficiaryCpf}, {$inc: {money: transferMoney.value}})
    const account = await accountCollection.findOne({cpf: transferMoney.cpf})
    return new Promise(resolve => resolve({
      name: account.name,
      cpf: account.cpf,
      beneficiaryCpf: transferMoney.beneficiaryCpf,
      value: transferMoney.value
    }))
  }

  async withdraw (withdrawData: WithdrawModel): Promise<WithdrawReturnModel> {
    const taxValue = withdrawData.value*0.01
    const accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.updateOne({cpf: withdrawData.cpf}, {$inc: {money: -withdrawData.value}})
    const account = await accountCollection.findOne({cpf: withdrawData.cpf})
    return new Promise(resolve => resolve({
      name: account.name,
      cpf: account.cpf,
      value: withdrawData.value,
      tax: taxValue
    }))
  }

}