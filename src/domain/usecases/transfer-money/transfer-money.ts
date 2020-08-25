import { TransferMoneyModel } from "../../models/transfer-money-model";

export interface TransferModel {
  cpf: string
  password: string
  beneficiaryCpf: string
  value: number
}

export interface TransferMoney {
  transfer (transferMoney: TransferModel): Promise<TransferMoneyModel>
}
