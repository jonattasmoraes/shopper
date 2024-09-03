import { InvalidTypeError, MeasuresNotFound } from '../../common/utils/ApiError'
import { Measure } from '../../entities/Measure'
import { IMeasureRepository } from '../../repositories/IMeasureRepository'
import { IListUseCase } from '../IMeasureUseCase'
import { ListMeasuresDto, MeasureDto } from '../MeasureUseCaseDto'

export class ListMeasuresUseCase implements IListUseCase {
  private constructor(readonly repository: IMeasureRepository) {}

  public static build(repository: IMeasureRepository): ListMeasuresUseCase {
    return new ListMeasuresUseCase(repository)
  }

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
    if (type && type !== 'WATER' && type !== 'GAS') {
      throw new InvalidTypeError()
    }
  }

  private async fetchMeasures(customerCode: string, type?: string): Promise<Measure[]> {
    const measures = await this.repository.list(customerCode, type)
    if (!measures || measures.length === 0) {
      throw new MeasuresNotFound()
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
