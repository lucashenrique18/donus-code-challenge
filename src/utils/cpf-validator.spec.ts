import { CpfValidatorAdapter } from './cpf-validator-adapter'

const makeSut = (): CpfValidatorAdapter => {
  return new CpfValidatorAdapter()
}

describe('CpfValidator Adapter', () => {
  test('Should return false if validator returns false ', () => {
    const sut = makeSut()
    const isEmailValid = sut.isValid('invalid_cpf')
    expect(isEmailValid).toBe(false)
  })

})
