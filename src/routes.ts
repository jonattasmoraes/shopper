import { Router } from 'express'
import swaggerUi from 'swagger-ui-express'
import { CreateMeasureController } from './controllers/CreateMeasureController'
import swaggerHandler from './docs/swaggerConfig'

const router = Router()

const createController = CreateMeasureController.build()

// Routes
router.post('/upload', (req, res) => createController.createMeasure(req, res))

// Swagger
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerHandler))

export default router
