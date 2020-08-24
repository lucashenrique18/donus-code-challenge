import { Router } from "express"
import { makeMovimentationController } from '../factories/movimentation-factory'
import { adaptRoute } from '../adapters/express-route-adapter'

export default (router: Router): void => {
  router.post('/movimentations', adaptRoute(makeMovimentationController()))
}