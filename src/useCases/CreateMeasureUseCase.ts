import { SendError } from '../common/errors/SendError'
import { geminiProvider } from '../config/GeminiProvider'
import { IMeasureRepository } from '../domain/IMeasureRepository'
import { Measure } from '../domain/Measure'
import { CreateInputDTO, CreateOutputDTO } from './CreateMeasureDTO'

export class CreateMeasureUseCase {
  constructor(private readonly createMeasureRepository: IMeasureRepository) {}

  async createMeasure(data: CreateInputDTO): Promise<CreateOutputDTO> {
    try {
      this.validateImage(data.image)

      const { text: value, uri: imageUrl } = await geminiProvider(data.image)

      const measure = new Measure({
        customerCode: data.customer_code,
        measureDatetime: data.measure_datetime,
        measureType: data.measure_type,
        imageUrl: imageUrl,
        measureValue: this.parseMeasureValue(value),
      })

      console.log(measure)

      await this.createMeasureRepository.save(measure)

      return {
        image_url: measure.imageUrl,
        measure_value: measure.measureValue,
        measure_uuid: measure.measureUuid,
      }
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  private parseMeasureValue(text: string): number {
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
    if (!image || !isValidBase64(image)) {
      throw new SendError(
        400,
        'A imagem é obrigatória e deve ser uma imagem base64, por favor revise os dados e tente novamente',
        'INVALID_DATA',
      )
    }
  }
}

function isValidBase64(base64String: string): boolean {
  const base64Regex =
    /^(?:[A-Za-z0-9+/]{4}){2,}(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/
  return base64Regex.test(base64String) && base64String.length % 4 === 0
}
