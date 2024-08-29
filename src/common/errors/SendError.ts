import { AppError } from './AppError'

export class SendError extends AppError {
  constructor(code: number, message: string, type: string) {
    super(message, code, type)
  }
}
