import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'
import { hash } from 'bcrypt'

let accountCollection: Collection

describe('Deposit Routes', () => {
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

  test('Should return 200 on success', async () => {
    const password = await hash('123', 12)
    await accountCollection.insertOne({
      name: 'Lucas',
      cpf: '03256117937',
      password,
      money: 200
    })
    await accountCollection.insertOne({
      name: 'Matheus',
      cpf: '070.680.938-68',
      password,
      money: 100
    })
    await request(app)
      .post('/api/transfer')
      .send({
        cpf: '032.561.179-37',
        password: '123',
        beneficiaryCpf: '070.680.938-68',
        value: 100
      })
      .expect(200)
  })

  test('Should return 401 if cpf or password are incorrect/notexists', async () => {
    await request(app)
      .post('/api/transfer')
      .send({
        cpf: '032.561.179-37',
        password: '123',
        beneficiaryCpf: '070.680.938-68',
        value: 100
      })
      .expect(401)
  })

})