import { Router } from 'express'
import swaggerUi from 'swagger-ui-express'
import { CreateMeasureController } from './controllers/CreateMeasureController'
import swaggerHandler from './docs/swaggerConfig'
import { ConfirmMeasureController } from './controllers/PatchMeasureController'

const router = Router()

const createController = CreateMeasureController.build()
const confirmController = ConfirmMeasureController.build()

// Routes
router.post('/upload', (req, res) => createController.create(req, res))
router.patch('/confirm', (req, res) => confirmController.confirm(req, res))

// Swagger
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerHandler))

export default router
