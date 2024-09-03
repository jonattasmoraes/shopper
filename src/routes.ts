import { Router } from 'express'
import swaggerUi from 'swagger-ui-express'
import swaggerHandler from './docs/swaggerConfig'
import { ConfirmMeasureController } from './controllers/PatchMeasureController'
import { ListMeasureController } from './controllers/ListMeasuresController'
import { CreateMeasureController } from './controllers/CreateMeasureController'

const router = Router()

// Routes
router.post('/upload', new CreateMeasureController().create)
router.patch('/confirm', new ConfirmMeasureController().confirm)
router.get('/:customerCode/list', new ListMeasureController().list)

// Swagger
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerHandler))

export default router
