import { DepositAmount, DepositAmountModel } from "../../../domain/usecases/deposit-amount/deposit-amount";
import { AlterMoneyAccountRepository } from "../../protocols/db/account/alter-money-account-repository";
import { AccountMovimentationHistoryRepository } from '../../protocols/db/account/account-movimentation-history-repository'
import { DepositModel } from "../../../domain/models/deposit-model";

export class DepositAccount implements DepositAmount {
  constructor (private readonly alterMoneyAccountRepository: AlterMoneyAccountRepository, private readonly accountMovimentationHistoryRepository: AccountMovimentationHistoryRepository) {}

  async deposit (depositData: DepositAmountModel): Promise<DepositModel> {
    const depositWithBonus = depositData.depositValue+(depositData.depositValue*0.05)
    await this.accountMovimentationHistoryRepository.saveMovimentation({
      cpf: depositData.cpf,
      type: 'deposit',
      movimentation: {
        value: depositData.depositValue
      },
      date: new Date()
    })
    return await this.alterMoneyAccountRepository.deposit(Object.assign({}, depositData, { depositValue: depositWithBonus}))
  }
}