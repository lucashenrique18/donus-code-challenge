import { TransferController } from "../../presentation/controllers/transfer/transfer"
import { CpfValidatorAdapter } from "../../utils/cpf-validator-adapter"
import { BcryptAdapter } from "../../infra/criptography/bcrypt-adapter"
import { AccountMongoRepository } from "../../infra/db/mongodb/account-repository/account-mongo-repository"
import { DbAuthentication } from "../../data/usecases/authentication/db-authentication"
import { DbTransferMoney } from "../../data/usecases/transfer/db-transfer-money"

export const makeTransferController = (): TransferController => {
  const salt = 12
  const cpfValidatorAdapter = new CpfValidatorAdapter()
  const loadByCpfAndAlterMoneyAccountRepository = new AccountMongoRepository()
  const hashComparer = new BcryptAdapter(salt)
  const dbAuthentication = new DbAuthentication(loadByCpfAndAlterMoneyAccountRepository, hashComparer)
  const dbTransferMoney = new DbTransferMoney(loadByCpfAndAlterMoneyAccountRepository, loadByCpfAndAlterMoneyAccountRepository, loadByCpfAndAlterMoneyAccountRepository)
  return new TransferController(cpfValidatorAdapter, dbAuthentication, dbTransferMoney)
}