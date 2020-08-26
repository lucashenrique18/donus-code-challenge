import { DepositModel } from "../../../../domain/models/deposit-model";
import { DepositAmountModel } from "../../../../domain/usecases/deposit-amount/deposit-amount";
import { TransferModel } from "../../../../domain/usecases/transfer-money/transfer-money";
import { TransferMoneyModel } from "../../../../domain/models/transfer-money-model";
import { WithdrawReturnModel } from "../../../../domain/models/withdraw-return-model";
import { WithdrawModel } from "../../../../domain/usecases/withdraw/withdraw-money";

export interface AlterMoneyAccountRepository {
  deposit (deposit: DepositAmountModel): Promise<DepositModel>
  transfer (transferMoney: TransferModel): Promise<TransferMoneyModel>
  withdraw (withdrawData: WithdrawModel): Promise<WithdrawReturnModel>
}
