import { CpfValidator } from '../presentation/protocols/cpf-validator'

export class CpfValidatorAdapter implements CpfValidator {
  isValid (cpf: string): boolean {
    return false
  }
}