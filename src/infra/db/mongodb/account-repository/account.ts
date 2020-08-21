import { AddAccountRepository } from '../../../../data/protocols/add-account-repository'
import { AddAccountModel } from '../../../../domain/usecases/add-account/add-account'
import { AccountModel } from '../../../../domain/models/account-model'
import { MongoHelper } from '../helpers/mongo-helper'
import { LoadAccountByCpfRepository } from '../../../../data/protocols/load-account-by-cpf-repository'
import { AlterMoneyAccountRepository } from '../../../../data/protocols/alter-money-account-repository'
import { DepositAmountModel } from '../../../../domain/usecases/deposit-amount/deposit-amount'
import { DepositModel } from '../../../../domain/models/deposit-model'

export class AccountMongoRepository implements AddAccountRepository, LoadAccountByCpfRepository, AlterMoneyAccountRepository {

  async add (accountData: AddAccountModel): Promise<AccountModel>{
    const accountCollection = MongoHelper.getCollection('accounts')
    const result = await accountCollection.insertOne(accountData)
    const account = MongoHelper.map(result.ops[0])
    return new Promise(resolve => resolve(account))
  }

  async loadByCpf (cpf: string): Promise<AccountModel> {
    const accountCollection = MongoHelper.getCollection('accounts')
    const account = await accountCollection.findOne({cpf})
    return new Promise(resolve => resolve(account && MongoHelper.map(account)))
  }

  async deposit (depositData: DepositAmountModel): Promise<DepositModel> {
    const accountCollection = MongoHelper.getCollection('accounts')
    await accountCollection.updateOne({cpf: depositData.cpf}, {$inc: {money: depositData.depositValue}})
    const account = await accountCollection.findOne({cpf: depositData.cpf})
    return {name: account.name, cpf: account.cpf, depositValue: depositData.depositValue}
  }

}