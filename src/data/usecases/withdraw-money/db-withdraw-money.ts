import { WithdrawMoney, WithdrawModel } from "../../../domain/usecases/withdraw/withdraw-money"
import { AlterMoneyAccountRepository } from "../../protocols/db/account/alter-money-account-repository"
import { AccountMovimentationHistoryRepository } from "../../protocols/db/account/account-movimentation-history-repository"
import { WithdrawReturnModel } from "../../../domain/models/withdraw-return-model"
import { LoadAccountByCpfRepository } from "../../protocols/db/account/load-account-by-cpf-repository"

export class DbWithdrawMoney implements WithdrawMoney {
  constructor (private readonly loadAccountByCpfRepository: LoadAccountByCpfRepository, private readonly alterMoneyAccountRepository: AlterMoneyAccountRepository, private readonly accountMovimentationHistoryRepository: AccountMovimentationHistoryRepository) {}

  async withdraw (withdrawData: WithdrawModel): Promise<WithdrawReturnModel> {
    const account = await this.loadAccountByCpfRepository.loadByCpf(withdrawData.cpf)
    if (account.money < withdrawData.value) {
      return null
    }
    const taxValue = withdrawData.value*0.01
    const withdraw = await this.alterMoneyAccountRepository.withdraw(withdrawData)
    await this.accountMovimentationHistoryRepository.saveMovimentation({
      cpf: withdrawData.cpf,
      type: 'withdraw',
      movimentation: {
        value: withdrawData.value
      },
      date: new Date()
    })
    return { name: withdraw.name, cpf: withdraw.cpf, value: withdrawData.value-taxValue, tax: taxValue }
  }

}