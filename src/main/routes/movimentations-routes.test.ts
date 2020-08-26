import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'
import { hash } from 'bcrypt'

let movimentationsCollection: Collection
let accountCollection: Collection

describe('Movimentations Routes', () => {

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    movimentationsCollection = await MongoHelper.getCollection('movimentations')
    await movimentationsCollection.deleteMany({})
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  test('Should return 200 on success', async () => {
    const password = await hash('123', 12)
    await accountCollection.insertOne({
      name: 'Lucas',
      cpf: '03256117937',
      password
    })
    await movimentationsCollection.insertOne({
      cpf: '03256117937',
      type: 'deposit',
      movimentation: {
        value: 100
      },
      date: new Date(1466424490000)
    })
    await request(app)
      .post('/api/movimentations')
      .send({
        cpf: '03256117937',
        password: '123'
      })
      .expect(200)
  })

  test('Should return 401 if cpf or password are incorrect/notexists', async () => {
    await request(app)
      .post('/api/movimentations')
      .send({
        cpf: '03256117937',
        password: '123'
      })
      .expect(401)
  })

})
