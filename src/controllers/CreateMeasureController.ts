import { NextFunction, Request, Response } from 'express'
import { CreateMeasureUseCase } from '../useCases/implementation/CreateMeasureUseCase'
import { CreateInputDto } from '../useCases/MeasureUseCaseDto'

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
  private useCase: CreateMeasureUseCase

  constructor(useCase: CreateMeasureUseCase) {
    this.useCase = useCase
  }

  public static build(useCase: CreateMeasureUseCase): CreateMeasureController {
    return new CreateMeasureController(useCase)
  }

  public async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { image, customer_code, measure_type, measure_datetime } = req.body

      const data: CreateInputDto = {
        image: image,
        code: customer_code,
        datetime: measure_datetime,
        type: measure_type,
      }

      const result = await this.useCase.execute(data)
      res.status(200).json(result)
    } catch (error) {
      next(error)
    }
  }
}
