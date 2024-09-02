import { Router } from 'express'
import swaggerUi from 'swagger-ui-express'
import { CreateMeasureController } from './controllers/CreateMeasureController'
import swaggerHandler from './docs/swaggerConfig'
import { ConfirmMeasureController } from './controllers/PatchMeasureController'
import { ListMeasureController } from './controllers/ListMeasuresController'

const router = Router()

// Controllers
const createController = CreateMeasureController.build()
const confirmController = ConfirmMeasureController.build()
const listController = ListMeasureController.build()

// Routes
router.post('/upload', (req, res) => createController.create(req, res))
router.patch('/confirm', (req, res) => confirmController.confirm(req, res))
router.get('/:customerCode/list', (req, res) => listController.list(req, res))

// Swagger
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerHandler))

export default router
