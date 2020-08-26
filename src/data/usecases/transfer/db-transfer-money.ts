import { TransferMoney, TransferModel } from "../../../domain/usecases/transfer-money/transfer-money"
import { TransferMoneyModel } from "../../../domain/models/transfer-money-model"
import { LoadAccountByCpfRepository } from "../../protocols/db/account/load-account-by-cpf-repository"

export class DbTransferMoney implements TransferMoney {

  constructor (private readonly loadAccountByCpfRepository: LoadAccountByCpfRepository) {}

  async transfer (transferMoney: TransferModel): Promise<TransferMoneyModel> {
    const account = await this.loadAccountByCpfRepository.loadByCpf(transferMoney.cpf)
    if (account.money < transferMoney.value) {
      return null
    }
    return null
  }
}
