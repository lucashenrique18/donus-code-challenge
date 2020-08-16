import { CpfValidatorAdapter } from './cpf-validator-adapter'
import validator from '@fnando/cpf'

jest.mock('@fnando/cpf', () => ({
  isValid (): boolean {
    return true
  }
}))

const makeSut = (): CpfValidatorAdapter => {
  return new CpfValidatorAdapter()
}

describe('CpfValidator Adapter', () => {
  test('Should return false if validator returns false ', () => {
    const sut = makeSut()
    jest.spyOn(validator, 'isValid').mockReturnValueOnce(false)
    const isCpfValid = sut.isValid('invalid_cpf')
    expect(isCpfValid).toBe(false)
  })

  test('Should return false if validator returns true ', () => {
    const sut = makeSut()
    const isCpfValid = sut.isValid('valid_cpf')
    expect(isCpfValid).toBe(true)
  })

  test('Should call validator with correct cpf', () => {
    const sut = makeSut()
    const isCpfValidSpy = jest.spyOn(validator, 'isValid')
    sut.isValid('any_cpf')
    expect(isCpfValidSpy).toHaveBeenCalledWith('any_cpf')
  })

})
