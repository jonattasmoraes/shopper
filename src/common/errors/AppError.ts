export class AppError extends Error {
  public readonly statusCode: number
  public readonly errorCode: string

  constructor(message: string, statusCode: number, errorCode: string) {
    super(message)
    this.statusCode = statusCode
    this.errorCode = errorCode
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }
}
