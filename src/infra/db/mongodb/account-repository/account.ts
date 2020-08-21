import { AddAccountRepository } from '../../../../data/protocols/add-account-repository'
import { AddAccountModel } from '../../../../domain/usecases/add-account/add-account'
import { AccountModel } from '../../../../domain/models/account-model'
import { MongoHelper } from '../helpers/mongo-helper'
import { LoadAccountByCpfRepository } from '../../../../data/protocols/load-account-by-cpf-repository'

export class AccountMongoRepository implements AddAccountRepository, LoadAccountByCpfRepository {

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

}