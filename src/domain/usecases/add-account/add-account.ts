import { AccountModel } from '../../models/account-model'

export interface AddAccountModel {
  name: string
  cpf: string
  password: string
}

export interface AddAccount {
  add (account: AddAccountModel): AccountModel
}