import { NextFunction, Request, Response } from 'express'
import { CreateMeasureUseCase } from '../useCases/implementation/CreateMeasureUseCase'
import { CreateInputDto } from '../useCases/MeasureUseCaseDto'
import { MeasureRepositoryPostgresImpl } from '../repositories/postgres/MeasureRepositoryPostgresImpl'
import { pool } from '../config/Postgres'

/**
 * @swagger
 * /upload:
 *   post:
 *     tags: [Measures]
 *     summary: Create a new measure
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateInputDTO'
 *     responses:
 *       200:
 *         description: Measure created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateOutputDTO'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorDTO'
 *       409:
 *         description: Conflict error due to duplicate measure or similar issue
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorDTO'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorDTO'
 */
export class CreateMeasureController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { image, customer_code, measure_type, measure_datetime } = req.body

      const repository = MeasureRepositoryPostgresImpl.build(pool)
      const useCase = CreateMeasureUseCase.build(repository)

      const data: CreateInputDto = {
        image: image,
        code: customer_code,
        type: measure_type,
        datatime: measure_datetime,
      }

      const result = await useCase.execute(data)
      res.status(200).json(result)
    } catch (error) {
      next(error)
    }
  }
}
