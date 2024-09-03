export class ApiError extends Error {
  public readonly statusCode: number
  public readonly errorCode: string

  constructor(statusCode: number, errorCode: string, message: string) {
    console.log(statusCode, errorCode, message)
    super(message)
    this.statusCode = statusCode
    this.errorCode = errorCode
  }
}

export class InvalidDataError extends ApiError {
  constructor(message: string) {
    super(400, 'INVALID_DATA', message)
  }
}

export class InvalidTypeError extends ApiError {
  constructor() {
    super(400, 'INVALID_TYPE', 'Tipo de medição não permitida')
  }
}

export class DoubleReportError extends ApiError {
  constructor() {
    super(409, 'DOUBLE_REPORT', 'Leitura do mês já realizada')
  }
}

export class DuplicationError extends ApiError {
  constructor() {
    super(409, 'CONFIRMATION_DUPLICATE', 'Leitura do mês já realizada')
  }
}

export class MeasureNotFound extends ApiError {
  constructor() {
    super(404, 'MEASURE_NOT_FOUND', 'Leitura do mês já realizada')
  }
}

export class MeasuresNotFound extends ApiError {
  constructor() {
    super(404, 'MEASURES_NOT_FOUND', 'Nenhuma leitura encontrada')
  }
}
