import { Router } from "express"
import { makeWithdrawController } from '../factories/withdraw-factory'
import { adaptRoute } from '../adapters/express-route-adapter'

export default (router: Router): void => {
  router.post('/withdraw', adaptRoute(makeWithdrawController()))
}