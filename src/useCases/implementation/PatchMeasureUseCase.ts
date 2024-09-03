import validator from 'validator'
import { IMeasureRepository } from '../../repositories/IMeasureRepository'
import { Measure } from '../../entities/Measure'
import { IConfirmUseCase } from '../IMeasureUseCase'
import { DuplicationError, InvalidDataError, MeasureNotFound } from '../../common/errors/ApiError'

export class PatchMeasureUseCase implements IConfirmUseCase {
  private constructor(readonly repository: IMeasureRepository) {}

  public static build(repository: IMeasureRepository): PatchMeasureUseCase {
    return new PatchMeasureUseCase(repository)
  }

  async execute(id: string, value: number): Promise<void> {
    try {
      this.validateId(id)

      const measure = await this.findMeasureById(id)

      this.updateValue(measure, value)

      this.validateValueIsConfirmed(measure)

      await this.repository.confirm(measure.id, measure.value)
    } catch (error) {
      console.error('Error updating measure:', error)
      throw error
    }
  }

  private validateId(id: string): void {
    if (!id || typeof id !== 'string' || !validator.isUUID(id)) {
      throw new InvalidDataError(
        'O measure_uuid informado é inválido. Por favor, revise os dados e tente novamente.',
      )
    }
  }

  private async findMeasureById(id: string): Promise<Measure> {
    const measure = await this.repository.findById(id)

    if (!measure) {
      throw new MeasureNotFound()
    }

    return measure
  }

  private updateValue(measure: Measure, value: number): void {
    measure.value = value
  }

  private validateValueIsConfirmed(measure: Measure): void {
    console.log(measure.hasConfirmed)
    if (measure.hasConfirmed) {
      throw new DuplicationError()
    }
  }
}
