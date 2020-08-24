export interface MovimentationModel {
  cpf: string
  type: string
  movimentation: {
    value: number
    beneficiary?: string
  }
  date: Date
}
