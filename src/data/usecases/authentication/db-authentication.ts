import { Authentication } from '../../../domain/usecases/authentication/authentication'
import { LoadAccountByCpfRepository } from '../../protocols/load-account-by-cpf-repository';

export class DbAuthentication implements Authentication {
  private readonly loadAccountByCpfRepository: LoadAccountByCpfRepository
  constructor (loadAccountByCpfRepository: LoadAccountByCpfRepository) {
    this.loadAccountByCpfRepository = loadAccountByCpfRepository
  }

  async auth (cpf: string, password: string): Promise<boolean> {
    await this.loadAccountByCpfRepository.load(cpf)
    return null
  }

}
