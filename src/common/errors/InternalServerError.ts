import { AppError } from './AppError'

export class InternalServerError extends AppError {
  constructor() {
    super('Internal Server Error', 500, 'INTERNAL_SERVER_ERROR')
  }
}
