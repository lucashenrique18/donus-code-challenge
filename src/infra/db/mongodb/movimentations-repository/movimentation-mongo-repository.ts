import { LoadMovimentationRepository, LoadMovimentationModel } from "../../../../data/protocols/db/account/load-movimentations-repository";
import { MongoHelper } from '../helpers/mongo-helper'

export class MovimentationMongoRepository implements LoadMovimentationRepository {

  async loadMovimentations (cpf: string): Promise<Array<LoadMovimentationModel>> {
    const movimentationsCollection = await MongoHelper.getCollection('movimentations')
    const movimentations = await movimentationsCollection.find({cpf}).toArray()
    return new Promise(resolve => resolve(movimentations && movimentations.map(({_id, ...rest}) => Object.assign({}, rest, { id: _id }))))
  }
}