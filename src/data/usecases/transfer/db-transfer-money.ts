import { TransferMoney, TransferModel, TransferMoneyModel, LoadAccountByCpfRepository, AlterMoneyAccountRepository, AccountMovimentationHistoryRepository } from "./db-transfer-money-protocol"

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
    const transfer = await this.alterMoneyAccountRepository.transfer(transferMoney)
    await this.accountMovimentationHistoryRepository.saveMovimentation({
      cpf: transferMoney.cpf,
      type: 'transfer',
      date: new Date(),
      movimentation: {
        value: transferMoney.value,
        beneficiary: transferMoney.beneficiaryCpf
      }
    })
    return transfer
  }
}
