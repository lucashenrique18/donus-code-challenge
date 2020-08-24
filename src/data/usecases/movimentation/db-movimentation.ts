import { LoadMovimentation } from "../../../domain/usecases/movimentation/movimentation";
import { MovimentationModel } from "../../../domain/models/movimentation-model";
import { LoadMovimentationRepository } from "../../protocols/db/account/load-movimentations-repository";

export class DbMovimentation implements LoadMovimentation {
  constructor (private readonly accountMovimentationHistoryRepository: LoadMovimentationRepository) {}
  async load (cpf: string): Promise<MovimentationModel> {
    const movimentations = await this.accountMovimentationHistoryRepository.loadMovimentations(cpf)
    return movimentations
  }
}
