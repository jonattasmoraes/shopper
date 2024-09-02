import { expectClientError } from '../../common/utils/ErrorValidator'
import { geminiProvider } from '../../config/GeminiProvider'
import { Measure } from '../../entities/Measure'
import { InMemoryMeasureRepository } from '../../repositories/in-memory/MeasureInMemoryRepository'
import { CreateMeasureUseCase } from './CreateMeasureUseCase'

jest.mock('../../config/GeminiProvider', () => ({
  geminiProvider: jest.fn(),
}))

const MEASURE_ALREADY_EXISTS = 'Leitura do mês já realizada'
const ERROR_IMAGE_INVALID =
  'A imagem é obrigatória e deve ser uma imagem base64, por favor revise os dados e tente novamente'
const ERROR_DATETIME_INVALID =
  'O measure_datetime não foi informado ou é inválido, por favor revise os dados e tente novamente'
const ERROR_MEASURE_TYPE_INVALID =
  'O measure_type não foi informado ou é diferente de WATE e GAS, por favor revise os dados e tente novamente'
const ERROR_CUSTOMER_CODE_INVALID =
  'O customer_code nao foi informado ou é invalido, por favor revise os dados e tente novamente'
const ERROR_PARSE_MEASURE_VALUE =
  'Não foi possível parsear o valor da medida, por favor revise os dados e tente novamente'
const INVALID_DATA = 'INVALID_DATA'
const INVALID_TYPE = 'INVALID_TYPE'
const DOUBLE_REPORT = 'DOUBLE_REPORT'

describe('Create Measure Use Case', () => {
  let repository: InMemoryMeasureRepository
  let createMeasureUseCase: CreateMeasureUseCase

  beforeEach(() => {
    repository = InMemoryMeasureRepository.build()
    createMeasureUseCase = CreateMeasureUseCase.build(repository)
    ;(geminiProvider as jest.Mock).mockResolvedValue({
      text: '123',
      uri: 'https://mocked-url.com/image.png',
    })
  })

  it('should create a measure successfully', async () => {
    const inputData = {
      image: 'dGVzdA==',
      datatime: '2024-09-01T12:00:00Z',
      code: 'CUSTOMER_CODE',
      type: 'WATER',
    }

    const result = await createMeasureUseCase.execute(inputData)

    expect(result.image_url).toBe('https://mocked-url.com/image.png')
    expect(result.measure_value).toBe(123)
    expect(geminiProvider).toHaveBeenCalledWith(inputData.image)
  })

  it('should throw an error if the measure already exists', async () => {
    const date = new Date('2024-09-01T12:00:00Z')
    const measure = Measure.create('CUSTOMER_CODE', 'GAS', date)

    await repository.save(measure)

    const inputData = {
      image: 'dGVzdA==',
      datatime: '2024-09-01T12:00:00Z',
      code: 'CUSTOMER_CODE',
      type: 'GAS',
    }

    return expectClientError(
      createMeasureUseCase.execute(inputData),
      409,
      DOUBLE_REPORT,
      MEASURE_ALREADY_EXISTS,
    )
  })

  it('should throw an error if the parse image fails', async () => {
    ;(geminiProvider as jest.Mock).mockResolvedValue({
      text: 'invalid_value',
      uri: 'https://mocked-url.com/image.png',
    })

    const inputData = {
      image: 'dGVzdA==',
      datatime: '2024-09-01T12:00:00Z',
      code: 'CUSTOMER_CODE',
      type: 'GAS',
    }

    return expectClientError(
      createMeasureUseCase.execute(inputData),
      400,
      INVALID_DATA,
      ERROR_PARSE_MEASURE_VALUE,
    )
  })

  it('should throw an error if image is not a base64', async () => {
    const inputData = {
      image: '@dGVzdA==',
      datatime: '2024-09-01T12:00:00Z',
      code: 'CUSTOMER_CODE',
      type: 'WATER',
    }

    return expectClientError(
      createMeasureUseCase.execute(inputData),
      400,
      INVALID_DATA,
      ERROR_IMAGE_INVALID,
    )
  })

  it('should throw an error if image is empty', async () => {
    const inputData = {
      image: '',
      datatime: '2024-09-01T12:00:00Z',
      code: 'CUSTOMER_CODE',
      type: 'WATER',
    }

    return expectClientError(
      createMeasureUseCase.execute(inputData),
      400,
      INVALID_DATA,
      ERROR_IMAGE_INVALID,
    )
  })

  it("should throw an error if measure_datetime isn't valid", async () => {
    const inputData = {
      image: 'dGVzdA==',
      datatime: '2024-09-32T12:00:00',
      code: 'CUSTOMER_CODE',
      type: 'WATER',
    }

    return expectClientError(
      createMeasureUseCase.execute(inputData),
      400,
      INVALID_DATA,
      ERROR_DATETIME_INVALID,
    )
  })

  it('should throw an error if measure_datetime is empty', async () => {
    const inputData = {
      image: 'dGVzdA==',
      datatime: '',
      code: 'CUSTOMER_CODE',
      type: 'WATER',
    }

    return expectClientError(
      createMeasureUseCase.execute(inputData),
      400,
      INVALID_DATA,
      ERROR_DATETIME_INVALID,
    )
  })

  it('should throw an error if measure_type is different from "WATER" or "GAS"', async () => {
    const inputData = {
      image: 'dGVzdA==',
      datatime: '2024-09-01T12:00:00Z',
      code: 'CUSTOMER_CODE',
      type: 'INVALID_TYPE',
    }

    return expectClientError(
      createMeasureUseCase.execute(inputData),
      400,
      INVALID_TYPE,
      ERROR_MEASURE_TYPE_INVALID,
    )
  })

  it('should throw an error if measure_type is empty', async () => {
    const inputData = {
      image: 'dGVzdA==',
      datatime: '2024-09-01T12:00:00Z',
      code: 'CUSTOMER_CODE',
      type: '',
    }

    return expectClientError(
      createMeasureUseCase.execute(inputData),
      400,
      INVALID_TYPE,
      ERROR_MEASURE_TYPE_INVALID,
    )
  })

  it('should throw an error if measure_type is lowercase', async () => {
    const inputData = {
      image: 'dGVzdA==',
      datatime: '2024-09-01T12:00:00Z',
      code: 'CUSTOMER_CODE',
      type: 'water',
    }

    return expectClientError(
      createMeasureUseCase.execute(inputData),
      400,
      INVALID_TYPE,
      ERROR_MEASURE_TYPE_INVALID,
    )
  })

  it('should throw an error if customer_code is empty', async () => {
    const inputData = {
      image: 'dGVzdA==',
      datatime: '2024-09-01T12:00:00Z',
      code: '',
      type: 'WATER',
    }

    return expectClientError(
      createMeasureUseCase.execute(inputData),
      400,
      INVALID_DATA,
      ERROR_CUSTOMER_CODE_INVALID,
    )
  })
})
