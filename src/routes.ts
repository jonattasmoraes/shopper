import { Router } from 'express'
import { MeasureRepositoryPostgresImpl } from './repositories/MeasureRepositoryPostgresImpl'
import { pool } from './config/Postgres'
import { CreateMeasureUseCase } from './useCases/createMeasureUseCase/CreateMeasureUseCase'
import { CreateMeasureController } from './controllers/CreateMeasureController'
import { PatchMeasureUseCase } from './useCases/patchMeasureUseCase/PatchMeasureUseCase'
import { PatchMeasureController } from './controllers/PatchMeasureController'

const router = Router()

const measureRepository = new MeasureRepositoryPostgresImpl(pool)

// Create measure and use case instance
const createUseCase = new CreateMeasureUseCase(measureRepository)
const createController = new CreateMeasureController(createUseCase)

// Patch measure and use case instance
const patchUseCase = new PatchMeasureUseCase(measureRepository)
const patchController = new PatchMeasureController(patchUseCase)

// Routes
router.post('/upload', (req, res) => createController.createMeasure(req, res))
router.patch('/confirm', (req, res) => patchController.updateMeasure(req, res))

export default router
