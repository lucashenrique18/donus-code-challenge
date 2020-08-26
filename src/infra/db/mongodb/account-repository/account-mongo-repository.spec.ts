import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account-mongo-repository'
import { Collection } from 'mongodb'

let accountCollection: Collection

describe('Account Mongo Repository', () => {

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  test('Should return an account on add success', async () => {
    const sut = new AccountMongoRepository()
    const account = await sut.add({
      name: 'any_name',
      cpf: 'any_cpf',
      password: 'any_password'
    })
    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('any_name')
    expect(account.cpf).toBe('any_cpf')
    expect(account.password).toBe('any_password')
  })

  test('Should return an MovimentationAccount on saveMovimentation success', async () => {
    const sut = new AccountMongoRepository()
    const account = await sut.saveMovimentation({
      cpf: 'any_cpf',
      type: 'any_movimentation',
      movimentation : {
        value: 100
      },
      date: new Date()
    })
    expect(account).toBeTruthy()
    expect(account.cpf).toBe('any_cpf')
    expect(account.type).toBe('any_movimentation')
    expect(account.movimentation.value).toBe(100)
  })

  test('Should return an account on loadByCpf success', async () => {
    const sut = new AccountMongoRepository()
    await accountCollection.insertOne({
      name: 'any_name',
      cpf: 'any_cpf',
      password: 'any_password',
      money: 0
    })
    const account = await sut.loadByCpf('any_cpf')
    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('any_name')
    expect(account.cpf).toBe('any_cpf')
    expect(account.password).toBe('any_password')
  })

  test('Should return null if loadByCpf fails', async () => {
    const sut = new AccountMongoRepository()
    const account = await sut.loadByCpf('any_cpf')
    expect(account).toBeFalsy()
  })

  test('Should return an Deposit on deposit success', async () => {
    const sut = new AccountMongoRepository()
    await accountCollection.insertOne({
      name: 'any_name',
      cpf: 'any_cpf',
      password: 'any_password',
      money: 0
    })
    const account = await sut.deposit({
      cpf: 'any_cpf',
      password: 'any_password',
      depositValue: 100
    })
    expect(account).toBeTruthy()
    expect(account.name).toBe('any_name')
    expect(account.cpf).toBe('any_cpf')
    expect(account.depositValue).toBe(100)
  })

  test('Should return an Transfer on transfer success', async () => {
    const sut = new AccountMongoRepository()
    await accountCollection.insertOne({
      name: 'any_name',
      cpf: 'any_cpf',
      password: 'any_password',
      money: 1000
    })
    const account = await sut.transfer({
      cpf: 'any_cpf',
      password: 'any_password',
      beneficiaryCpf: 'any_cpf_beneficiary',
      value: 100
    })
    expect(account).toBeTruthy()
    expect(account.name).toBe('any_name')
    expect(account.cpf).toBe('any_cpf')
    expect(account.beneficiaryCpf).toBe('any_cpf_beneficiary')
    expect(account.value).toBe(100)
  })

})
