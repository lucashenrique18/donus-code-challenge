import { LoadMovimentation } from "../../../domain/usecases/movimentation/movimentation";
import { MovimentationModel } from "../../../domain/models/movimentation-model";
import { LoadMovimentationRepository } from "../../protocols/db/account/load-movimentations-repository";

export class DbMovimentation implements LoadMovimentation {
  constructor (private readonly loadMovimentationRepository: LoadMovimentationRepository) {}
  async load (cpf: string): Promise<Array<MovimentationModel>> {
    const movimentations = await this.loadMovimentationRepository.loadMovimentations(cpf)
    return movimentations
  }
}
