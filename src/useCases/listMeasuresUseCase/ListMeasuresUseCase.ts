import { SendError } from '../../common/errors/SendError'
import { Measure } from '../../entities/Measure'
import { IMeasureRepository } from '../../repositories/IMeasureRepository'
import { MeasuresDataDTO, MeasureDTO } from './ListMeasuresDTO'

export class ListMeasuresUseCase {
  constructor(private readonly listMeasureRepository: IMeasureRepository) {}

  async execute(code: string, type?: string): Promise<MeasuresDataDTO> {
    // Valida o tipo de measure
    this.validateType(type)

    try {
      // Retorna os dados da consulta
      const measures = await this.listMeasureRepository.list(code, type)

      if (!measures) {
        throw new SendError(
          404,
          'Leituras não encontradas',
          'MEASURES_NOT_FOUND',
        )
      }

      // Cria e retorna o DTO de saída
      const measureDTOs = measures.map(this.toMeasureDTO)

      return {
        customer_code: code,
        measures: measureDTOs,
      }
    } catch (error) {
      console.error('Error retrieving measures:', error)
      throw error
    }
  }

  private validateType(type: string | undefined): void {
    if (type && !this.isValidType(type)) {
      throw new SendError(400, 'Tipo de medição não permitida', 'INVALID_TYPE')
    }
  }

  private isValidType(type: string): boolean {
    const validTypes = ['WATER', 'GAS']
    return validTypes.includes(type)
  }

  private toMeasureDTO(measure: Measure): MeasureDTO {
    return {
      measure_uuid: measure.id,
      measure_datetime: measure.dataTime,
      measure_type: measure.type,
      has_confirmed: measure.hasConfirmed,
      image_url: measure.imageUrl,
    }
  }
}
