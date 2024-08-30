import { v4 as uuid } from 'uuid'
import moment from 'moment'
import validator from 'validator'
import { SendError } from '../../common/errors/SendError'
import { geminiProvider } from '../../config/GeminiProvider'
import { IMeasureRepository } from '../../domain/IMeasureRepository'
import { Measure } from '../../domain/Measure'
import { CreateInputDTO, CreateOutputDTO } from './CreateMeasureDTO'

export class CreateMeasureUseCase {
  constructor(private readonly createMeasureRepository: IMeasureRepository) {}

  async createMeasure(data: CreateInputDTO): Promise<CreateOutputDTO> {
    try {
      this.validateImage(data.image)

      // Valida e formata a data
      const validDate = this.validateAndFormatDate(data.measure_datetime)

      // Verifica se a medida já existe
      await this.checkIfMeasureAlreadyExists(data, validDate)

      // Cria o objeto Measure e obtém os valores adicionais
      const measure = await this.buildMeasure(data, validDate)

      // Salva a medida no repositório
      await this.createMeasureRepository.save(measure)

      // Constrói e retorna o DTO de saída
      return this.buildCreateOutputDTO(measure)
    } catch (error) {
      console.error('Error:', error)
      throw error
    }
  }

  private async checkIfMeasureAlreadyExists(
    data: CreateInputDTO,
    validDate: string,
  ): Promise<void> {
    const measureMonth = moment(validDate).format('YYYY-MM')
    const measureDate = new Date(measureMonth)
    const measureExists = await this.createMeasureRepository.findMeasure({
      customerCode: data.customer_code,
      measureDatetime: measureDate,
      measureType: data.measure_type,
    })

    if (measureExists) {
      throw new SendError(409, 'Leitura do mês já realizada', 'DOUBLE_REPORT')
    }
  }

  private async buildMeasure(
    data: CreateInputDTO,
    validDate: string,
  ): Promise<Measure> {
    const measureDate = new Date(validDate)
    const measure = new Measure({
      measureUuid: uuid(),
      customerCode: data.customer_code,
      measureDatetime: measureDate,
      measureType: data.measure_type,
      hasConfirmed: false,
    })

    const { text: value, uri: imageUrl } = await geminiProvider(data.image)

    measure.imageUrl = imageUrl
    measure.measureValue = this.parseAndValidateMeasureValue(value)

    return measure
  }

  private buildCreateOutputDTO(measure: Measure): CreateOutputDTO {
    return {
      image_url: measure.imageUrl,
      measure_value: measure.measureValue,
      measure_uuid: measure.measureUuid,
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
