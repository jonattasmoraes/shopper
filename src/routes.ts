import { Router } from 'express'
import swaggerUi from 'swagger-ui-express'
import swaggerHandler from './docs/swaggerConfig'
import {
  confirmMeasureBuilder,
  createMeasureBuilder,
  listMeasureBuilder,
} from './controllers/ControllerBuilder'

const router = Router()

// Rotas
router.post('/upload', (req, res, next) => createMeasureBuilder().create(req, res, next))
router.patch('/confirm', (req, res, next) => confirmMeasureBuilder().confirm(req, res, next))
router.get('/:customerCode/list', (req, res, next) => listMeasureBuilder().list(req, res, next))

// Swagger
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerHandler))

export default router
