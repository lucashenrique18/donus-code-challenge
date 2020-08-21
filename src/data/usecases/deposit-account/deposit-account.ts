import { DepositAmount, DepositAmountModel } from "../../../domain/usecases/deposit-amount/deposit-amount";
import { AlterMoneyAccountRepository } from "../../protocols/alter-money-account-repository";
import { DepositModel } from "../../../domain/models/deposit-model";

export class DepositAccount implements DepositAmount {
  private readonly alterMoneyAccountRepository: AlterMoneyAccountRepository
  constructor (alterMoneyAccountRepository: AlterMoneyAccountRepository) {
    this.alterMoneyAccountRepository = alterMoneyAccountRepository
  }

  async deposit (depositValue: DepositAmountModel): Promise<DepositModel> {
    const deposit = await this.alterMoneyAccountRepository.deposit(depositValue.depositValue)
    return deposit
  }
}