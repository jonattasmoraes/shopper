import validator from 'validator'
import { SendError } from '../../common/errors/SendError'
import { IMeasureRepository } from '../../domain/IMeasureRepository'
import { PatchInputDTO } from './PatchMeasureDTO'

export class PatchMeasureUseCase {
  constructor(private readonly patchMeasureRepository: IMeasureRepository) {}

  async updateMeasure(data: PatchInputDTO): Promise<void> {
    try {
      this.validateUuidAndValue(data)

      await this.patchMeasureRepository.findMeasureByUuid(data.measure_uuid)
    } catch (error) {
      console.error('Error:', error)
      throw error
    }
  }

  private validateUuidAndValue(data: PatchInputDTO): void {
    if (!data.measure_uuid || !data.confirmed_value) {
      throw new SendError(
        400,
        'O measure_uuid e confirmed_value devem ser informados. Por favor, revise os dados e tente novamente.',
        'INVALID_DATA',
      )
    }

    if (
      !data.confirmed_value ||
      !Number.isInteger(data.confirmed_value) ||
      data.confirmed_value <= 0
    ) {
      throw new SendError(
        400,
        'O confirmed_value deve ser um numero inteiro e maior que 0. Por favor, revise os dados e tente novamente.',
        'INVALID_DATA',
      )
    }

    if (!data.measure_uuid || !validator.isUUID(data.measure_uuid)) {
      throw new SendError(
        400,
        'O measure_uuid informado é inválido ou não foi informado. Por favor, revise os dados e tente novamente.',
        'INVALID_DATA',
      )
    }
  }
}
