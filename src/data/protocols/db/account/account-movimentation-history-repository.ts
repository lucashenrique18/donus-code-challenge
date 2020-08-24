import { MovimentationModel } from '../../../../domain/models/movimentation-model'

export interface AccountMovimentationHistoryRepository {
  saveMovimentation (movimentationData: MovimentationModel): Promise<MovimentationModel>
}
