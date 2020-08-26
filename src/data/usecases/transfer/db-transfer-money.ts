import { TransferMoney, TransferModel } from "../../../domain/usecases/transfer-money/transfer-money"
import { TransferMoneyModel } from "../../../domain/models/transfer-money-model"
import { LoadAccountByCpfRepository } from "../../protocols/db/account/load-account-by-cpf-repository"
import { AlterMoneyAccountRepository } from "../../protocols/db/account/alter-money-account-repository"

export class DbTransferMoney implements TransferMoney {

  constructor (private readonly loadAccountByCpfRepository: LoadAccountByCpfRepository, private readonly alterMoneyAccountRepository: AlterMoneyAccountRepository) {}

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
    return null
  }
}
