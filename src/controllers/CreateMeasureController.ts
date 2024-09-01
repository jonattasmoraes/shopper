import { Request, Response } from 'express'
import { AppError } from '../common/errors/AppError'
import { ErrorHandler } from '../common/errors/ErrorHandler'
import { InternalServerError } from '../common/errors/InternalServerError'
import { CreateMeasureUseCase } from '../useCases/implementation/CreateMeasureUseCase'
import { CreateInputDto, CreateOutputDto } from '../useCases/MeasureUseCaseDto'

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
  constructor(private readonly measureUseCase: CreateMeasureUseCase) {}

  async createMeasure(req: Request, res: Response): Promise<void> {
    try {
      const data: CreateInputDto = req.body
      const result: CreateOutputDto = await this.measureUseCase.execute(data)
      res.status(200).json(result)
    } catch (error: unknown) {
      if (error instanceof AppError) {
        ErrorHandler(res, error)
      } else {
        ErrorHandler(res, new InternalServerError())
      }
    }
  }
}
