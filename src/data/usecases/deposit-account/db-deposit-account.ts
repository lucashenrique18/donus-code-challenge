import { DepositAmount, DepositAmountModel, AlterMoneyAccountRepository, AccountMovimentationHistoryRepository, DepositModel } from "./db-deposit-account-protocol";

export class DepositAccount implements DepositAmount {
  constructor (private readonly alterMoneyAccountRepository: AlterMoneyAccountRepository, private readonly accountMovimentationHistoryRepository: AccountMovimentationHistoryRepository) {}

  async deposit (depositData: DepositAmountModel): Promise<DepositModel> {
    const depositWithBonus = depositData.depositValue+(depositData.depositValue*0.05)
    await this.accountMovimentationHistoryRepository.saveMovimentation({
      cpf: depositData.cpf,
      type: 'deposit',
      movimentation: {
        value: depositWithBonus
      },
      date: new Date()
    })
    return await this.alterMoneyAccountRepository.deposit(Object.assign({}, depositData, { depositValue: depositWithBonus}))
  }
}