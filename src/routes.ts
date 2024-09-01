import { Router } from 'express'
import swaggerUi from 'swagger-ui-express'
import { MeasureRepositoryPostgresImpl } from './repositories/postgres/MeasureRepositoryPostgresImpl'
import { pool } from './config/Postgres'
import { CreateMeasureUseCase } from './useCases/implementation/CreateMeasureUseCase'
import { CreateMeasureController } from './controllers/CreateMeasureController'
import { PatchMeasureUseCase } from './useCases/implementation/PatchMeasureUseCase'
import { PatchMeasureController } from './controllers/PatchMeasureController'
import { ListMeasuresUseCase } from './useCases/implementation/ListMeasuresUseCase'
import { ListMeasureController } from './controllers/ListMeasuresController'
import swaggerHandler from './docs/swaggerConfig'

const router = Router()

const measureRepository = new MeasureRepositoryPostgresImpl(pool)

// Create measure and use case instance
const createUseCase = new CreateMeasureUseCase(measureRepository)
const createController = new CreateMeasureController(createUseCase)

// Patch measure and use case instance
const patchUseCase = new PatchMeasureUseCase(measureRepository)
const patchController = new PatchMeasureController(patchUseCase)

// List measures and use case instance
const listUseCase = new ListMeasuresUseCase(measureRepository)
const listController = new ListMeasureController(listUseCase)

// Routes
router.post('/upload', (req, res) => createController.createMeasure(req, res))
router.patch('/confirm', (req, res) => patchController.updateMeasure(req, res))
router.get('/:customerCode/list', (req, res) =>
  listController.listMeasures(req, res),
)
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerHandler))

export default router
