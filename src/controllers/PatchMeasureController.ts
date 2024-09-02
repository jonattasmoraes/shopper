import { Request, Response } from 'express'
import { PatchMeasureUseCase } from '../useCases/implementation/PatchMeasureUseCase'
import { MeasureRepositoryPostgresImpl } from '../repositories/postgres/MeasureRepositoryPostgresImpl'
import { pool } from '../config/Postgres'
import { BaseError, ErrorHandler } from '../common/errors/BaseError'

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
  constructor() {}

  public static build() {
    return new ConfirmMeasureController()
  }

  async confirm(req: Request, res: Response): Promise<void> {
    try {
      const { measure_uuid, confirmed_value } = req.body

      const repository = MeasureRepositoryPostgresImpl.build(pool)
      const useCase = PatchMeasureUseCase.build(repository)

      await useCase.execute(measure_uuid, confirmed_value)

      res.status(200).json({ success: true })
    } catch (error: unknown) {
      if (error instanceof BaseError) {
        ErrorHandler(res, error)
      } else {
        res.status(500).json({
          status: 'error',
          message: 'Internal server error',
        })
      }
    }
  }
}
