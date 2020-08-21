import { DepositModel } from "../../domain/models/deposit-model";

export interface AlterMoneyAccountRepository {
  deposit (depositValue: number): Promise<DepositModel>
}