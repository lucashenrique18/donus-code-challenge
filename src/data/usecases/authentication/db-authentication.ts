import { Authentication } from '../../../domain/usecases/authentication/authentication'
import { LoadAccountByCpfRepository } from '../../protocols/load-account-by-cpf-repository';
import { HashComparer } from '../../protocols/hash-comparer';

export class DbAuthentication implements Authentication {
  private readonly loadAccountByCpfRepository: LoadAccountByCpfRepository
  private readonly hashComparer: HashComparer
  constructor (loadAccountByCpfRepository: LoadAccountByCpfRepository, hashComparer: HashComparer) {
    this.loadAccountByCpfRepository = loadAccountByCpfRepository
    this.hashComparer = hashComparer
  }

  async auth (cpf: string, password: string): Promise<boolean> {
    const account = await this.loadAccountByCpfRepository.load(cpf)
    if (account) {
      const isValidPassword = await this.hashComparer.compare(password, account.password)
      if(isValidPassword){
        return true
      }
    }
    return false
  }
}
