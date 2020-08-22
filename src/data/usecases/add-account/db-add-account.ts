import { AddAccount, AddAccountModel, AccountModel, Encrypter, AddAccountRepository, LoadAccountByCpfRepository } from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  constructor (private readonly encrypter: Encrypter, private readonly addAccountRepository: AddAccountRepository, private readonly loadAccountByCpfRepository: LoadAccountByCpfRepository) {}

  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const account = await this.loadAccountByCpfRepository.loadByCpf(accountData.cpf)
    if (!account) {
      const hashedPassword = await this.encrypter.encrypt(accountData.password)
      const newAccount = await this.addAccountRepository.add(Object.assign({}, accountData, { cpf: accountData.cpf.replace(/([-.]*)/g, ''), password: hashedPassword, money: 0 }))
      return new Promise(resolve => resolve(newAccount))
    }
    return null
  }
}