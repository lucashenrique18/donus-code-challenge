import { Router } from "express"
import { makeDepositController } from '../factories/deposit-factory'
import { adaptRoute } from '../adapters/express-route-adapter'

export default (router: Router): void => {
  router.post('/deposit', adaptRoute(makeDepositController()))
}