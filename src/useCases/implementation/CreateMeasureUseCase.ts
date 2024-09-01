import moment from 'moment'
import validator from 'validator'
import { SendError } from '../../common/errors/SendError'
import { geminiProvider } from '../../config/GeminiProvider'
import { CreateInputDto, CreateOutputDto } from '../MeasureUseCaseDto'
import { IMeasureRepository } from '../../repositories/IMeasureRepository'
import { Measure } from '../../entities/Measure'

export class CreateMeasureUseCase {
  constructor(private readonly createMeasureRepository: IMeasureRepository) {}

  async execute(data: CreateInputDto): Promise<CreateOutputDto> {
    try {
      this.validateImage(data.image)

      const validDate = this.validateAndFormatDate(data.datatime)

      await this.checkIfMeasureExists(data, validDate)

      const measure = await this.buildMeasure(data, validDate)

      await this.createMeasureRepository.save(measure)

      return this.buildCreateOutputDTO(measure)
    } catch (error) {
      console.error('Error:', error)
      throw error
    }
  }

  private async checkIfMeasureExists(data: CreateInputDto, validDate: string): Promise<void> {
    const measureDate = new Date(validDate)
    const measureExists = await this.createMeasureRepository.findByData(
      data.code,
      data.type,
      measureDate,
    )

    if (measureExists) {
      throw new SendError(409, 'Leitura do mês já realizada', 'DOUBLE_REPORT')
    }
  }

  private async buildMeasure(data: CreateInputDto, validDate: string): Promise<Measure> {
    const measureDate = new Date(validDate)
    const measure = Measure.create(data.code, data.type, measureDate)

    const { text: value, uri: imageUrl } = await geminiProvider(data.image)

    measure.imageUrl = imageUrl
    measure.value = this.parseAndValidateMeasureValue(value)

    return measure
  }

  private buildCreateOutputDTO(measure: Measure): CreateOutputDto {
    return {
      image_url: measure.imageUrl,
      measure_value: measure.value,
      measure_uuid: measure.id,
    }
  }

  private validateAndFormatDate(date: string): string {
    const parsedDate = moment(date)

    if (!parsedDate.isValid()) {
      throw new SendError(
        400,
        'O measure_datetime não foi informado ou é inválido, por favor revise os dados e tente novamente',
        'INVALID_DATA',
      )
    }

    return parsedDate.format('YYYY-MM-DD HH:mm:ss')
  }

  private parseAndValidateMeasureValue(text: string): number {
    const measureValue = parseInt(text, 10)
    if (isNaN(measureValue)) {
      throw new SendError(
        400,
        'Não foi possível parsear o valor da medida, por favor revise os dados e tente novamente',
        'INVALID_DATA',
      )
    }
    return measureValue
  }

  private validateImage(image: string): void {
    if (!image || !this.isValidBase64(image)) {
      throw new SendError(
        400,
        'A imagem é obrigatória e deve ser uma imagem base64, por favor revise os dados e tente novamente',
        'INVALID_DATA',
      )
    }
  }

  private isValidBase64(base64String: string): boolean {
    return validator.isBase64(base64String)
  }
}
