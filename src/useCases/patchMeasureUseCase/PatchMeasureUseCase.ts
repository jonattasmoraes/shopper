import validator from 'validator'
import { SendError } from '../../common/errors/SendError'
import { PatchInputDTO } from './PatchMeasureDTO'
import { IMeasureRepository } from '../../repositories/IMeasureRepository'
import { Measure } from '../../entities/Measure'

export class PatchMeasureUseCase {
  constructor(private readonly measureRepository: IMeasureRepository) {}

  async execute(data: PatchInputDTO): Promise<void> {
    try {
      this.validateInputData(data)

      const measure = await this.findMeasureByUuid(data.measure_uuid)

      this.ensureMeasureNotConfirmed(measure)

      await this.confirmMeasure(data.measure_uuid, data.confirmed_value)
    } catch (error) {
      console.error('Error updating measure:', error)
      throw error
    }
  }

  private validateInputData(data: PatchInputDTO): void {
    this.validateMeasureUuid(data.measure_uuid)
    this.validateConfirmedValue(data.confirmed_value)
  }

  private validateMeasureUuid(measureUuid: string): void {
    if (!measureUuid || !validator.isUUID(measureUuid)) {
      throw new SendError(
        400,
        'O measure_uuid informado é inválido. Por favor, revise os dados e tente novamente.',
        'INVALID_DATA',
      )
    }
  }

  private validateConfirmedValue(confirmedValue: number): void {
    if (!Number.isInteger(confirmedValue) || confirmedValue <= 0) {
      throw new SendError(
        400,
        'O confirmed_value deve ser um número inteiro e maior que 0. Por favor, revise os dados e tente novamente.',
        'INVALID_DATA',
      )
    }
  }

  private async findMeasureByUuid(measureUuid: string): Promise<Measure> {
    const measure = await this.measureRepository.findById(measureUuid)

    if (!measure) {
      throw new SendError(
        404,
        'Leitura do mês não encontrada',
        'MEASURE_NOT_FOUND',
      )
    }

    return measure
  }

  private ensureMeasureNotConfirmed(measure: Measure): void {
    if (measure.hasConfirmed) {
      throw new SendError(
        409,
        'Leitura do mês já confirmada',
        'CONFIRMATION_DUPLICATE',
      )
    }
  }

  private async confirmMeasure(
    measureUuid: string,
    confirmedValue: number,
  ): Promise<void> {
    await this.measureRepository.confirm(measureUuid, confirmedValue)
  }
}
