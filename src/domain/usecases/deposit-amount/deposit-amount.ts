import { DepositModel } from '../../models/deposit-model'

export interface DepositAmountModel {
  cpf: string
  password: string
  depositValue: number
}

export interface DepositAmount {
  deposit (depositData: DepositAmountModel): Promise<DepositModel>
}