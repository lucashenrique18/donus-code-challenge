import { MovimentationModel } from '../../../../domain/models/movimentation-model'

export interface LoadMovimentationRepository {
  loadMovimentations (cpf: string): Promise<MovimentationModel>
}
