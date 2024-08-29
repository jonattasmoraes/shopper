import { Request, Response } from 'express'
import { PatchInputDTO } from '../useCases/patchMeasureUseCase/PatchMeasureDTO'
import { PatchMeasureUseCase } from '../useCases/patchMeasureUseCase/PatchMeasureUseCase'
import { AppError } from '../common/errors/AppError'
import { InternalServerError } from '../common/errors/InternalServerError'
import { ErrorHandler } from '../common/errors/ErrorHandler'

export class PatchMeasureController {
  constructor(private readonly patchMeasureUseCase: PatchMeasureUseCase) {}

  async updateMeasure(req: Request, res: Response): Promise<void> {
    try {
      const data: PatchInputDTO = req.body

      await this.patchMeasureUseCase.updateMeasure(data)

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
