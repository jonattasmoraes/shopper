import validator from 'validator'
import { SendError } from '../../common/errors/SendError'
import { IMeasureRepository } from '../../domain/IMeasureRepository'
import { PatchInputDTO } from './PatchMeasureDTO'
import { Measure } from '../../domain/Measure'

export class PatchMeasureUseCase {
  constructor(private readonly patchMeasureRepository: IMeasureRepository) {}

  async updateMeasure(data: PatchInputDTO): Promise<void> {
    try {
      this.validateInputData(data)

      const measure = await this.patchMeasureRepository.findMeasureByUuid(
        data.measure_uuid,
      )

      this.ensureMeasureNotConfirmed(measure)

      await this.patchMeasureRepository.confirmMeasure(
        data.measure_uuid,
        data.confirmed_value,
      )
    } catch (error) {
      console.error('Error:', error)
      throw error
    }
  }

  private validateInputData(data: PatchInputDTO): void {
    if (!data.measure_uuid || !data.confirmed_value) {
      throw new SendError(
        400,
        'O measure_uuid e confirmed_value devem ser informados. Por favor, revise os dados e tente novamente.',
        'INVALID_DATA',
      )
    }

    if (!Number.isInteger(data.confirmed_value) || data.confirmed_value <= 0) {
      throw new SendError(
        400,
        'O confirmed_value deve ser um número inteiro e maior que 0. Por favor, revise os dados e tente novamente.',
        'INVALID_DATA',
      )
    }

    if (!validator.isUUID(data.measure_uuid)) {
      throw new SendError(
        400,
        'O measure_uuid informado é inválido. Por favor, revise os dados e tente novamente.',
        'INVALID_DATA',
      )
    }
  }

  private ensureMeasureNotConfirmed(measure: Measure): void {
    if (measure.hasConfirmed) {
      throw new SendError(
        409,
        'Leitura do mês já confirmada',
        'MEASURE_ALREADY_CONFIRMED',
      )
    }
  }
}
