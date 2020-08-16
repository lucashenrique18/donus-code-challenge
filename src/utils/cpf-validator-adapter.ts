import { CpfValidator } from '../presentation/protocols/cpf-validator'
import * as validator from '@fnando/cpf'

export class CpfValidatorAdapter implements CpfValidator {
  isValid (cpf: string): boolean {
    return validator.isValid(cpf)
  }
}