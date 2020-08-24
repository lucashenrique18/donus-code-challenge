export interface MovimentationModel {
  cpf: string
  movimentationType: string
  data: {
    value: number
    beneficiary?: string
  }
}
