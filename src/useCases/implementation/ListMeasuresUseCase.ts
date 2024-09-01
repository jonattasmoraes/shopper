import { ClientError } from '../../common/errors/BaseError'
import { Measure } from '../../entities/Measure'
import { IMeasureRepository } from '../../repositories/IMeasureRepository'
import { IListUseCase } from '../IMeasureUseCase'
import { ListMeasuresDto, MeasureDto } from '../MeasureUseCaseDto'

export class ListMeasuresUseCase implements IListUseCase {
  constructor(private readonly measureRepository: IMeasureRepository) {}

  async execute(customerCode: string, type?: string): Promise<ListMeasuresDto> {
    this.validateType(type)

    const measures = await this.fetchMeasures(customerCode, type)

    const measureDTOs = measures.map(this.toMeasureDTO)

    return {
      customer_code: customerCode,
      measures: measureDTOs,
    }
  }

  private validateType(type?: string): void {
    const validTypes = ['WATER', 'GAS']
    if (type && !validTypes.includes(type)) {
      throw new ClientError(400, 'INVALID_TYPE', 'Tipo de medição não permitida')
    }
  }

  private async fetchMeasures(customerCode: string, type?: string): Promise<Measure[]> {
    const measures = await this.measureRepository.list(customerCode, type)
    if (!measures || measures.length === 0) {
      throw new ClientError(404, 'MEASURES_NOT_FOUND', 'Nenhuma leitura encontrada')
    }
    return measures
  }

  private toMeasureDTO(measure: Measure): MeasureDto {
    return {
      measure_uuid: measure.id,
      measure_datetime: measure.dataTime,
      measure_type: measure.type,
      has_confirmed: measure.hasConfirmed,
      image_url: measure.imageUrl,
    }
  }
}
