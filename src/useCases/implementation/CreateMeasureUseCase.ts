import moment from 'moment'
import validator from 'validator'
import { geminiProvider } from '../../config/GeminiProvider'
import { CreateInputDto, CreateOutputDto } from '../MeasureUseCaseDto'
import { IMeasureRepository } from '../../repositories/IMeasureRepository'
import { Measure } from '../../entities/Measure'
import { ICreateUseCase } from '../IMeasureUseCase'
import { DoubleReportError, InvalidDataError } from '../../common/utils/ApiError'

export class CreateMeasureUseCase implements ICreateUseCase {
  private constructor(readonly repository: IMeasureRepository) {}

  public static build(repository: IMeasureRepository): CreateMeasureUseCase {
    return new CreateMeasureUseCase(repository)
  }

  async execute(data: CreateInputDto): Promise<CreateOutputDto> {
    try {
      this.validateImage(data.image)

      const validDate = this.validateAndFormatDate(data.datatime)

      await this.checkIfMeasureExists(data, validDate)

      const measure = await this.buildMeasure(data, validDate)

      await this.repository.save(measure)

      return this.buildCreateOutputDTO(measure)
    } catch (error) {
      console.error('Error:', error)
      throw error
    }
  }

  private async checkIfMeasureExists(data: CreateInputDto, validDate: string): Promise<void> {
    const measureDate = new Date(validDate)
    const measureExists = await this.repository.findByData(data.code, data.type, measureDate)

    if (measureExists) {
      throw new DoubleReportError()
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
      throw new InvalidDataError(
        'O measure_datetime não foi informado ou é inválido, por favor revise os dados e tente novamente',
      )
    }

    return parsedDate.format('YYYY-MM-DD HH:mm:ss')
  }

  private parseAndValidateMeasureValue(text: string): number {
    const measureValue = parseInt(text, 10)
    if (isNaN(measureValue)) {
      throw new InvalidDataError(
        'Não foi possível parsear o valor da medida, por favor revise os dados e tente novamente',
      )
    }
    return measureValue
  }

  private validateImage(image: string): void {
    if (!image || !this.isValidBase64(image)) {
      throw new InvalidDataError(
        'A imagem é obrigatória e deve ser uma imagem base64, por favor revise os dados e tente novamente',
      )
    }
  }

  private isValidBase64(base64String: string): boolean {
    return validator.isBase64(base64String)
  }
}
