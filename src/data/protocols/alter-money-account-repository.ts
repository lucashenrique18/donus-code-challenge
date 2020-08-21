import { DepositModel } from "../../domain/models/deposit-model";
import { DepositAmountModel } from "../../domain/usecases/deposit-amount/deposit-amount";

export interface AlterMoneyAccountRepository {
  deposit (deposit: DepositAmountModel): Promise<DepositModel>
}
