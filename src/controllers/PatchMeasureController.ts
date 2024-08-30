import { Request, Response } from 'express'
import { PatchInputDTO } from '../useCases/patchMeasureUseCase/PatchMeasureDTO'
import { PatchMeasureUseCase } from '../useCases/patchMeasureUseCase/PatchMeasureUseCase'
import { AppError } from '../common/errors/AppError'
import { InternalServerError } from '../common/errors/InternalServerError'
import { ErrorHandler } from '../common/errors/ErrorHandler'

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
export class PatchMeasureController {
  constructor(private readonly patchMeasureUseCase: PatchMeasureUseCase) {}

  async updateMeasure(req: Request, res: Response): Promise<void> {
    try {
      const data: PatchInputDTO = req.body

      await this.patchMeasureUseCase.execute(data)

      res.status(200).json({ success: true })
    } catch (error: unknown) {
      if (error instanceof AppError) {
        ErrorHandler(res, error)
      } else {
        ErrorHandler(res, new InternalServerError())
      }
    }
  }
}
