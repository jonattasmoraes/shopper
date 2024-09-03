import { NextFunction, Request, Response } from 'express'
import { ApiError } from '../common/utils/ApiError'

export const errorMiddleware = (
  error: Error & Partial<ApiError>,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const statusCode = error.statusCode ?? 500
  const errorCode = error.errorCode ?? 'INTERNAL_SERVER_ERROR'
  const message = error.statusCode ? error.message : 'Internal Server Error'
  return res.status(statusCode).json({
    error_code: errorCode,
    error_description: message,
  })
}
