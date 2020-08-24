import { MovimentationModel } from '../../models/movimentation-model'

export interface LoadMovimentationsModel {
  cpf: string
  password: string
}

export interface LoadMovimentation {
  load (cpf: string): Promise<MovimentationModel>
}