import { DepositModel } from "../../../../domain/models/deposit-model";
import { DepositAmountModel } from "../../../../domain/usecases/deposit-amount/deposit-amount";
import { TransferModel } from "../../../../domain/usecases/transfer-money/transfer-money";
import { TransferMoneyModel } from "../../../../domain/models/transfer-money-model";

export interface AlterMoneyAccountRepository {
  deposit (deposit: DepositAmountModel): Promise<DepositModel>
  transfer (transferMoney: TransferModel): Promise<TransferMoneyModel>
}
