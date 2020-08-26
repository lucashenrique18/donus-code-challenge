import { Router } from "express"
import { makeTransferController } from '../factories/transfer-factory'
import { adaptRoute } from '../adapters/express-route-adapter'

export default (router: Router): void => {
  router.post('/transfer', adaptRoute(makeTransferController()))
}