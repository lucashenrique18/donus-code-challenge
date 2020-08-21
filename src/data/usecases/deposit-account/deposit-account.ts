import { DepositAmount, DepositAmountModel } from "../../../domain/usecases/deposit-amount/deposit-amount";
import { AlterMoneyAccountRepository } from "../../protocols/alter-money-account-repository";
import { DepositModel } from "../../../domain/models/deposit-model";

export class DepositAccount implements DepositAmount {
  private readonly alterMoneyAccountRepository: AlterMoneyAccountRepository
  constructor (alterMoneyAccountRepository: AlterMoneyAccountRepository) {
    this.alterMoneyAccountRepository = alterMoneyAccountRepository
  }

  async deposit (depositData: DepositAmountModel): Promise<DepositModel> {
    const depositWithBonus = depositData.depositValue+(depositData.depositValue*0.05)
    return await this.alterMoneyAccountRepository.deposit(Object.assign({}, depositData, { depositValue: depositWithBonus}))
  }
}