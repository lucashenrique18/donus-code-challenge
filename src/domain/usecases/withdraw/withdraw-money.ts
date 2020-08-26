import { WithdrawReturnModel } from '../../models/withdraw-return-model'

export interface WithdrawModel {
  cpf: string
  password: string
  value: number
}

export interface WithdrawMoney {
  withdraw (withdrawData: WithdrawModel): Promise<WithdrawReturnModel>
}