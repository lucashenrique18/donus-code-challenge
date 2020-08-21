import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account'
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
    accountCollection = MongoHelper.getCollection('accounts')
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

  test('Should return an account on loadByCpf success', async () => {
    const sut = new AccountMongoRepository()
    await accountCollection.insertOne({
      name: 'any_name',
      cpf: 'any_cpf',
      password: 'any_password'
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
})
