import { MovimentationModel } from '../../models/movimentation-model'

export interface LoadMovimentationsModel {
  cpf: string
  password: string
}

export interface DepositAmount {
  loadMovimentations (depositData: LoadMovimentationsModel): Promise<MovimentationModel>
}