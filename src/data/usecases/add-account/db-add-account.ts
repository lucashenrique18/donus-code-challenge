import { AddAccount, AddAccountModel, AccountModel, Encrypter, AddAccountRepository, LoadAccountByCpfRepository } from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  constructor (private readonly encrypter: Encrypter, private readonly addAccountRepository: AddAccountRepository, private readonly loadAccountByCpfRepository: LoadAccountByCpfRepository) {}

  async add (accountData: AddAccountModel): Promise<AccountModel> {
    await this.loadAccountByCpfRepository.loadByCpf(accountData.cpf)
    const hashedPassword = await this.encrypter.encrypt(accountData.password)
    const account = await this.addAccountRepository.add(Object.assign({}, accountData, { cpf: accountData.cpf.replace(/([-.]*)/g, ''), password: hashedPassword, money: 0 }))
    return new Promise(resolve => resolve(account))
  }
}