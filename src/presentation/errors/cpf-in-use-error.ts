export class CpfInUseError extends Error {
  constructor () {
    super('The received CPF is already in use')
    this.name = 'CpfInUseError'
  }
}