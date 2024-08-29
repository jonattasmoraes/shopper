import { Response } from 'express'
import { AppError } from './AppError'

export function ErrorHandler(res: Response, error: AppError): void {
  res.status(error.statusCode).json({
    error_code: error.errorCode,
    error_description: error.message,
  })
}
