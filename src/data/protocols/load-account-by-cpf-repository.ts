import { AccountModel } from "../../domain/models/account-model";

export interface LoadAccountByCpfRepository {
  load (cpf: string): Promise<AccountModel>
}
