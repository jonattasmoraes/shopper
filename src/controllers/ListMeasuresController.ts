import { Request, Response } from 'express'
import { ListMeasuresUseCase } from '../useCases/listMeasuresUseCase/ListMeasuresUseCase'
import { ErrorHandler } from '../common/errors/ErrorHandler'
import { InternalServerError } from '../common/errors/InternalServerError'
import { AppError } from '../common/errors/AppError'

export class ListMeasureController {
  constructor(private readonly listMeasuresUseCase: ListMeasuresUseCase) {}

  async listMeasures(req: Request, res: Response): Promise<void> {
    try {
      const customerCode = req.params.customerCode
      const measureType = req.query.measure_type as string

      const measures = await this.listMeasuresUseCase.findMeasures(
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
