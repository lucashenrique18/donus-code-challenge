import { WithdrawController } from "../../presentation/controllers/withdraw/withdraw"
import { AccountMongoRepository } from "../../infra/db/mongodb/account-repository/account-mongo-repository"
import { BcryptAdapter } from "../../infra/criptography/bcrypt-adapter"
import { DbAuthentication } from "../../data/usecases/authentication/db-authentication"
import { CpfValidatorAdapter } from "../../utils/cpf-validator-adapter"
import { DbWithdrawMoney } from "../../data/usecases/withdraw-money/db-withdraw-money"

export const makeWithdrawController = (): WithdrawController => {
  const salt = 12
  const cpfValidatorAdapter = new CpfValidatorAdapter()
  const loadByCpfAndAlterMoneyAccountRepository = new AccountMongoRepository()
  const hashComparer = new BcryptAdapter(salt)
  const dbAuthentication = new DbAuthentication(loadByCpfAndAlterMoneyAccountRepository, hashComparer)
  const withdrawMoney = new DbWithdrawMoney(loadByCpfAndAlterMoneyAccountRepository, loadByCpfAndAlterMoneyAccountRepository, loadByCpfAndAlterMoneyAccountRepository)
  return new WithdrawController(cpfValidatorAdapter, dbAuthentication, withdrawMoney)
}