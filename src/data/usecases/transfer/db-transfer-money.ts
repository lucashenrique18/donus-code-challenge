import { TransferMoney, TransferModel } from "../../../domain/usecases/transfer-money/transfer-money"
import { TransferMoneyModel } from "../../../domain/models/transfer-money-model"
import { LoadAccountByCpfRepository } from "../../protocols/db/account/load-account-by-cpf-repository"
import { AlterMoneyAccountRepository } from "../../protocols/db/account/alter-money-account-repository"
import { AccountMovimentationHistoryRepository } from "../../protocols/db/account/account-movimentation-history-repository"

export class DbTransferMoney implements TransferMoney {

  constructor (private readonly loadAccountByCpfRepository: LoadAccountByCpfRepository, private readonly alterMoneyAccountRepository: AlterMoneyAccountRepository, private readonly accountMovimentationHistoryRepository: AccountMovimentationHistoryRepository) {}

  async transfer (transferMoney: TransferModel): Promise<TransferMoneyModel> {
    const account = await this.loadAccountByCpfRepository.loadByCpf(transferMoney.cpf)
    if (account.money < transferMoney.value) {
      return null
    }
    const beneficiary = await this.loadAccountByCpfRepository.loadByCpf(transferMoney.beneficiaryCpf)
    if (!beneficiary) {
      return undefined
    }
    await this.alterMoneyAccountRepository.transfer(transferMoney)
    await this.accountMovimentationHistoryRepository.saveMovimentation({
      cpf: transferMoney.cpf,
      type: 'transfer',
      date: new Date(),
      movimentation: {
        value: transferMoney.value,
        beneficiary: transferMoney.beneficiaryCpf
      }
    })
    return null
  }
}
