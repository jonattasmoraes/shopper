export class BaseError extends Error {
  public statusCode: number
  public errorCode: string
  public errorDescription: string

  constructor(statusCode: number, errorCode: string, errorDescription: string) {
    super(errorDescription)
    this.statusCode = statusCode
    this.errorCode = errorCode
    this.errorDescription = errorDescription

    Error.captureStackTrace(this, this.constructor)
  }
}

export class SenderError extends BaseError {
  constructor(statusCode: number, errorCode: string, errorDescription: string) {
    super(statusCode, errorCode, errorDescription)
  }
}
