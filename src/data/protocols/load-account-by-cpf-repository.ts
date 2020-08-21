import { AccountModel } from "../../domain/models/account-model";

export interface LoadAccountByCpfRepository {
  loadByCpf (cpf: string): Promise<AccountModel>
}
