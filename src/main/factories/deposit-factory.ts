import { CpfValidatorAdapter } from '../../utils/cpf-validator-adapter'
import { BcryptAdapter } from '../../infra/criptography/bcrypt-adapter'
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account-mongo-repository'
import { DepositController } from '../../presentation/controllers/deposit/deposit'
import { DbAuthentication } from '../../data/usecases/authentication/db-authentication'
import { DepositAccount } from '../../data/usecases/deposit-account/db-deposit-account'

export const makeDepositController = (): DepositController => {
  const salt = 12
  const loadByCpfAndAlterMoneyAccountRepository = new AccountMongoRepository()
  const depositAmount = new DepositAccount(loadByCpfAndAlterMoneyAccountRepository)
  const hashComparer = new BcryptAdapter(salt)
  const dbAuthentication = new DbAuthentication(loadByCpfAndAlterMoneyAccountRepository, hashComparer)
  const cpfValidatorAdapter = new CpfValidatorAdapter()
  return new DepositController(cpfValidatorAdapter, depositAmount, dbAuthentication)
}
