import { MovimentationModel } from '../../../../domain/models/movimentation-model'
import { LoadMovimentationsModel } from '../../../../domain/usecases/movimentation/movimentation';

export interface AccountMovimentationHistoryRepository {
  saveMovimentation (movimentationData: MovimentationModel): Promise<MovimentationModel>
  loadMovimentations (cpf: string): Promise<MovimentationModel>
}
