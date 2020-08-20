export interface Authentication {
  auth (cpf: string, password: string): Promise<boolean>
}
