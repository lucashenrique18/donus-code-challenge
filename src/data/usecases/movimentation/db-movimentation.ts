import { LoadMovimentation, LoadMovimentationsModel } from "../../../domain/usecases/movimentation/movimentation";
import { MovimentationModel } from "../../../domain/models/movimentation-model";
import { AccountMovimentationHistoryRepository } from "../../protocols/db/account/account-movimentation-history-repository";

export class DbMovimentation implements LoadMovimentation {
  constructor (private readonly accountMovimentationHistoryRepository: AccountMovimentationHistoryRepository) {}
  async load (cpf: string): Promise<MovimentationModel> {
    this.accountMovimentationHistoryRepository.loadMovimentations(cpf)
    return null
  }
}
