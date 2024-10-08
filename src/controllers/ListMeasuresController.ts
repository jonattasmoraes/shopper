import { Request, Response, NextFunction } from 'express'
import { ListMeasuresUseCase } from '../useCases/implementation/ListMeasuresUseCase'

/**
 * @swagger
 * /{customerCode}/list:
 *   get:
 *     tags: [Measures]
 *     summary: List all measures for a specific customer
 *     parameters:
 *       - in: path
 *         name: customerCode
 *         required: true
 *         schema:
 *           type: string
 *         description: The customer code to filter the measures
 *       - in: query
 *         name: measure_type
 *         schema:
 *           type: string
 *         description: The type of measure to filter by (optional)
 *     responses:
 *       200:
 *         description: A list of measures for the specified customer
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   image_url:
 *                     type: string
 *                     description: URL of the image
 *                   measure_value:
 *                     type: number
 *                     format: float
 *                     description: Value of the measure
 *                   measure_uuid:
 *                     type: string
 *                     description: UUID of the measure
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorDTO'
 *       404:
 *         description: Not found
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
export class ListMeasuresController {
  private useCase: ListMeasuresUseCase

  constructor(useCase: ListMeasuresUseCase) {
    this.useCase = useCase
  }

  public static build(useCase: ListMeasuresUseCase): ListMeasuresController {
    return new ListMeasuresController(useCase)
  }

  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const customerCode = req.params.customerCode
      const measureType = req.query.measure_type as string

      const measures = await this.useCase.execute(customerCode, measureType)

      res.status(200).json(measures)
    } catch (error) {
      next(error)
    }
  }
}
