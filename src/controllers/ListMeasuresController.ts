import { Request, Response } from 'express'
import { ListMeasuresUseCase } from '../useCases/implementation/ListMeasuresUseCase'
import { ErrorHandler } from '../common/errors/ErrorHandler'
import { InternalServerError } from '../common/errors/InternalServerError'
import { AppError } from '../common/errors/AppError'

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
export class ListMeasureController {
  constructor(private readonly listMeasuresUseCase: ListMeasuresUseCase) {}

  async listMeasures(req: Request, res: Response): Promise<void> {
    try {
      const customerCode = req.params.customerCode
      const measureType = req.query.measure_type as string

      const measures = await this.listMeasuresUseCase.execute(
        customerCode,
        measureType,
      )
      res.status(200).json(measures)
    } catch (error: unknown) {
      if (error instanceof AppError) {
        ErrorHandler(res, error)
      } else {
        ErrorHandler(res, new InternalServerError())
      }
    }
  }
}
