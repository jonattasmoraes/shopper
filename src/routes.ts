import { Router } from 'express'
import { MeasureRepositoryPostgresImpl } from './repositories/MeasureRepositoryPostgresImpl'
import { pool } from './config/Postgres'
import { CreateMeasureUseCase } from './useCases/createMeasureUseCase/CreateMeasureUseCase'
import { CreateMeasureController } from './controllers/CreateMeasureController'

const router = Router()

const measureRepository = new MeasureRepositoryPostgresImpl(pool)

// Create measure and use case instance
const measureUseCase = new CreateMeasureUseCase(measureRepository)
const measureController = new CreateMeasureController(measureUseCase)

router.post('/upload', (req, res) => measureController.createMeasure(req, res))

export default router
