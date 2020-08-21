import { LoadAccountByCpfRepository, HashComparer, Authentication } from './db-authentication-protocols'

export class DbAuthentication implements Authentication {
  constructor (private readonly loadAccountByCpfRepository: LoadAccountByCpfRepository, private readonly hashComparer: HashComparer) {}

  async auth (cpf: string, password: string): Promise<boolean> {
    const account = await this.loadAccountByCpfRepository.loadByCpf(cpf)
    if (account) {
      const isValidPassword = await this.hashComparer.compare(password, account.password)
      if(isValidPassword){
        return true
      }
    }
    return false
  }
}
