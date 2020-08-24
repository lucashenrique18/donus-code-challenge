import { MongoHelper } from '../helpers/mongo-helper'
import { MovimentationMongoRepository } from './movimentation-mongo-repository'
import { Collection } from 'mongodb'

let movimentationsCollection: Collection

describe('Account Mongo Repository', () => {

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    movimentationsCollection = await MongoHelper.getCollection('movimentations')
    await movimentationsCollection.deleteMany({})
  })

  test('Should return null if movimentations load fails', async () => {
    const sut = new MovimentationMongoRepository()
    const account = await sut.loadMovimentations('any_cpf')
    expect(account).toStrictEqual([])
  })

  test('Should return an movimentations on load success', async () => {
    const sut = new MovimentationMongoRepository()
    await movimentationsCollection.insertOne({
      cpf: 'any_cpf',
      type: 'any_type',
      movimentation: {
        value: 100,
        beneficiary: 'any_cpf'
      },
      date: new Date(1466424490000)
    })
    const movimentations = await sut.loadMovimentations('any_cpf')
    console.log(movimentations)
    expect(movimentations).toBeTruthy()
  })

})