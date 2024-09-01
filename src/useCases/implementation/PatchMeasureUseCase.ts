import validator from 'validator'
import { IMeasureRepository } from '../../repositories/IMeasureRepository'
import { Measure } from '../../entities/Measure'
import { ClientError } from '../../common/errors/BaseError'

export class PatchMeasureUseCase {
  constructor(private readonly measureRepository: IMeasureRepository) {}

  async execute(id: string, value: number): Promise<void> {
    try {
      this.validateId(id)

      const measure = await this.findMeasureById(id)

      this.updateValue(measure, value)

      this.validateValueIsConfirmed(measure)

      await this.measureRepository.confirm(measure.id, measure.value)
    } catch (error) {
      console.error('Error updating measure:', error)
      throw error
    }
  }

  private validateId(id: string): void {
    if (!id || typeof id !== 'string' || !validator.isUUID(id)) {
      throw new ClientError(
        400,
        'INVALID_DATA',
        'O measure_uuid informado é inválido. Por favor, revise os dados e tente novamente.',
      )
    }
  }

  private async findMeasureById(id: string): Promise<Measure> {
    const measure = await this.measureRepository.findById(id)

    if (!measure) {
      throw new ClientError(404, 'MEASURE_NOT_FOUND', 'Leitura do mês não encontrada.')
    }

    return measure
  }

  private updateValue(measure: Measure, value: number): void {
    measure.value = value
  }

  private validateValueIsConfirmed(measure: Measure): void {
    console.log(measure.hasConfirmed)
    if (measure.hasConfirmed) {
      throw new ClientError(409, 'Leitura do mês já confirmada', 'CONFIRMATION_DUPLICATE')
    }
  }
}
