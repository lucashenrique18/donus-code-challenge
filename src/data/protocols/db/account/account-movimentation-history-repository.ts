import { MovimentationModel } from '../../../../domain/models/movimentation-model'

export interface AccountMovimentationHistoryRepository {
  save (movimentation: MovimentationModel): void
}
