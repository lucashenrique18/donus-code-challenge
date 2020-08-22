import { SignUpController } from '../../presentation/controllers/signup/signup'
import { CpfValidatorAdapter } from '../../utils/cpf-validator-adapter'
import { DbAddAccount } from '../../data/usecases/add-account/db-add-account'
import { BcryptAdapter } from '../../infra/criptography/bcrypt-adapter'
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account-mongo-repository'

export const makeSignUpController = (): SignUpController => {
  const salt = 12
  const cpfValidatorAdapter = new CpfValidatorAdapter()
  const bcryptAdapter = new BcryptAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()
  const dbAddAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository, accountMongoRepository)
  return new SignUpController(cpfValidatorAdapter, dbAddAccount)
}
