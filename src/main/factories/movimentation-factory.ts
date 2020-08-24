import { CpfValidatorAdapter } from '../../utils/cpf-validator-adapter'
import { BcryptAdapter } from '../../infra/criptography/bcrypt-adapter'
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account-mongo-repository'
import { DepositController } from '../../presentation/controllers/deposit/deposit'
import { DbAuthentication } from '../../data/usecases/authentication/db-authentication'
import { DepositAccount } from '../../data/usecases/deposit-account/db-deposit-account'
import { MovimentationController } from '../../presentation/controllers/movimentations/movimentation'
import { DbMovimentation } from '../../data/usecases/movimentation/db-movimentation'
import { MovimentationMongoRepository } from '../../infra/db/mongodb/movimentations-repository/movimentation-mongo-repository'

export const makeMovimentationController = (): MovimentationController => {
  const salt = 12
  const cpfValidatorAdapter = new CpfValidatorAdapter()
  const loadByCpfAndAlterMoneyAccountRepository = new AccountMongoRepository()
  const hashComparer = new BcryptAdapter(salt)
  const dbAuthentication = new DbAuthentication(loadByCpfAndAlterMoneyAccountRepository, hashComparer)
  const loadMovimentationRepository = new MovimentationMongoRepository()
  const loadMovimentation = new DbMovimentation(loadMovimentationRepository)
  return new MovimentationController(cpfValidatorAdapter, dbAuthentication, loadMovimentation)
}