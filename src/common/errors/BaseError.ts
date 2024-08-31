export class BaseError extends Error {
  public statusCode: number

  constructor(message: string, statusCode: number) {
    super(message)
    this.statusCode = statusCode
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }
}

export class BadRequestError extends BaseError {
  constructor(message: string = 'Bad Request') {
    super(message, 400)
  }
}

export class NotFoundError extends BaseError {
  constructor(message: string = 'Not Found') {
    super(message, 404)
  }
}

export class ConflictError extends BaseError {
  constructor(message: string = 'Conflict') {
    super(message, 409)
  }
}
