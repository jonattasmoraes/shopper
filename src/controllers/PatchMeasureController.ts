import { NextFunction, Request, Response } from 'express'
import { PatchMeasureUseCase } from '../useCases/implementation/PatchMeasureUseCase'

/**
 * @swagger
 * /confirm:
 *   patch:
 *     tags: [Measures]
 *     summary: Update a measure
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PatchInputDTO'
 *       required: true
 *     responses:
 *       200:
 *         description: Successful update of the measure
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
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
 *       409:
 *         description: Conflict error due to request
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
export class ConfirmMeasureController {
  private useCase: PatchMeasureUseCase

  constructor(useCase: PatchMeasureUseCase) {
    this.useCase = useCase
  }

  static build(useCase: PatchMeasureUseCase): ConfirmMeasureController {
    return new ConfirmMeasureController(useCase)
  }

  async confirm(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { measure_uuid, confirmed_value } = req.body

      await this.useCase.execute(measure_uuid, confirmed_value)

      res.status(200).json({ success: true })
    } catch (error) {
      next(error)
    }
  }
}
