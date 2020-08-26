import { LoadMovimentation, MovimentationModel, LoadMovimentationRepository } from "./db-movimentation-protocol";

export class DbMovimentation implements LoadMovimentation {
  constructor (private readonly loadMovimentationRepository: LoadMovimentationRepository) {}
  async load (cpf: string): Promise<Array<MovimentationModel>> {
    const movimentations = await this.loadMovimentationRepository.loadMovimentations(cpf)
    return movimentations
  }
}
