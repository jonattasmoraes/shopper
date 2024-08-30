import { Request, Response } from 'express'
import { AppError } from '../common/errors/AppError'
import { ErrorHandler } from '../common/errors/ErrorHandler'
import { InternalServerError } from '../common/errors/InternalServerError'
import {
  CreateInputDTO,
  CreateOutputDTO,
} from '../useCases/createMeasureUseCase/CreateMeasureDTO'
import { CreateMeasureUseCase } from '../useCases/createMeasureUseCase/CreateMeasureUseCase'

export class CreateMeasureController {
  constructor(private readonly measureUseCase: CreateMeasureUseCase) {}

  async createMeasure(req: Request, res: Response): Promise<void> {
    try {
      const data: CreateInputDTO = req.body
      const result: CreateOutputDTO = await this.measureUseCase.execute(data)
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
