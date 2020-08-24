export interface LoadMovimentationModel {
  id?: string
  cpf: string
  type: string
  movimentation: {
    value: number
    beneficiary?: string
  }
  date: Date
}

export interface LoadMovimentationRepository {
  loadMovimentations (cpf: string): Promise<Array<LoadMovimentationModel>>
}
