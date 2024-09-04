import { ApiError } from '../../common/errors/ApiError'
import { geminiProvider } from '../../config/GeminiProvider'
import { Measure } from '../../entities/Measure'
import { InMemoryMeasureRepository } from '../../repositories/in-memory/MeasureInMemoryRepository'
import { CreateMeasureUseCase } from './CreateMeasureUseCase'

jest.mock('../../config/GeminiProvider', () => ({
  geminiProvider: jest.fn(),
}))

describe('Measure Use Case', () => {
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
      datetime: '2024-09-01T12:00:00Z',
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

    try {
      await repository.save(measure)

      const inputData = {
        image: 'dGVzdA==',
        datetime: '2024-09-01T12:00:00Z',
        code: 'CUSTOMER_CODE',
        type: 'GAS',
      }

      await createMeasureUseCase.execute(inputData)
    } catch (error) {
      if (error instanceof ApiError) {
        expect(error.statusCode).toBe(409)
        expect(error.errorCode).toBe('DOUBLE_REPORT')
        expect(error.message).toBe('Leitura do mês já realizada')
      }
    }
  })

  it('should throw an error if the parse image fails', async () => {
    ;(geminiProvider as jest.Mock).mockResolvedValue({
      text: 'invalid_value',
      uri: 'https://mocked-url.com/image.png',
    })

    try {
      const inputData = {
        image: 'dGVzdA==',
        datetime: '2024-09-01T12:00:00Z',
        code: 'CUSTOMER_CODE',
        type: 'GAS',
      }

      await createMeasureUseCase.execute(inputData)
    } catch (error) {
      if (error instanceof ApiError) {
        expect(error.statusCode).toBe(400)
        expect(error.errorCode).toBe('INVALID_DATA')
        expect(error.message).toBe(
          'Não foi possível parsear o valor da medida, por favor revise os dados e tente novamente',
        )
      }
    }
  })

  it('should throw an error if image is not a base64', async () => {
    try {
      const inputData = {
        image: '@dGVzdA==',
        datetime: '2024-09-01T12:00:00Z',
        code: 'CUSTOMER_CODE',
        type: 'WATER',
      }

      await createMeasureUseCase.execute(inputData)
    } catch (error) {
      if (error instanceof ApiError) {
        expect(error.statusCode).toBe(400)
        expect(error.errorCode).toBe('INVALID_DATA')
        expect(error.message).toBe(
          'A imagem é obrigatória e deve ser uma imagem base64, por favor revise os dados e tente novamente',
        )
      }
    }
  })

  it('should throw an error if image is empty', async () => {
    try {
      const inputData = {
        image: '',
        datetime: '2024-09-01T12:00:00Z',
        code: 'CUSTOMER_CODE',
        type: 'WATER',
      }

      await createMeasureUseCase.execute(inputData)
    } catch (error) {
      if (error instanceof ApiError) {
        expect(error.statusCode).toBe(400)
        expect(error.errorCode).toBe('INVALID_DATA')
        expect(error.message).toBe(
          'A imagem é obrigatória e deve ser uma imagem base64, por favor revise os dados e tente novamente',
        )
      }
    }
  })

  it("should throw an error if measure_datetime isn't valid", async () => {
    try {
      const inputData = {
        image: 'dGVzdA==',
        datetime: '2024-09-32T12:00:00',
        code: 'CUSTOMER_CODE',
        type: 'WATER',
      }

      await createMeasureUseCase.execute(inputData)
    } catch (error) {
      if (error instanceof ApiError) {
        expect(error.statusCode).toBe(400)
        expect(error.errorCode).toBe('INVALID_DATA')
        expect(error.message).toBe(
          'O measure_datetime não foi informado ou é inválido, por favor revise os dados e tente novamente',
        )
      }
    }
  })

  it('should throw an error if measure_datetime is empty', async () => {
    try {
      const inputData = {
        image: 'dGVzdA==',
        datetime: '',
        code: 'CUSTOMER_CODE',
        type: 'WATER',
      }

      await createMeasureUseCase.execute(inputData)
    } catch (error) {
      if (error instanceof ApiError) {
        expect(error.statusCode).toBe(400)
        expect(error.errorCode).toBe('INVALID_DATA')
        expect(error.message).toBe(
          'O measure_datetime não foi informado ou é inválido, por favor revise os dados e tente novamente',
        )
      }
    }
  })

  it('should throw an error if measure_type is different from "WATER" or "GAS"', async () => {
    try {
      const inputData = {
        image: 'dGVzdA==',
        datetime: '2024-09-01T12:00:00Z',
        code: 'CUSTOMER_CODE',
        type: 'INVALID_TYPE',
      }

      await createMeasureUseCase.execute(inputData)
    } catch (error) {
      if (error instanceof ApiError) {
        expect(error.statusCode).toBe(400)
        expect(error.errorCode).toBe('INVALID_DATA')
        expect(error.message).toBe(
          'O measure_type não foi informado ou é diferente de WATE e GAS, por favor revise os dados e tente novamente',
        )
      }
    }
  })

  it('should throw an error if measure_type is empty', async () => {
    try {
      const inputData = {
        image: 'dGVzdA==',
        datetime: '2024-09-01T12:00:00Z',
        code: 'CUSTOMER_CODE',
        type: '',
      }

      await createMeasureUseCase.execute(inputData)
    } catch (error) {
      if (error instanceof ApiError) {
        expect(error.statusCode).toBe(400)
        expect(error.errorCode).toBe('INVALID_DATA')
        expect(error.message).toBe(
          'O measure_type não foi informado ou é diferente de WATE e GAS, por favor revise os dados e tente novamente',
        )
      }
    }
  })

  it('should throw an error if measure_type is lowercase', async () => {
    try {
      const inputData = {
        image: 'dGVzdA==',
        datetime: '2024-09-01T12:00:00Z',
        code: 'CUSTOMER_CODE',
        type: 'water',
      }

      await createMeasureUseCase.execute(inputData)
    } catch (error) {
      if (error instanceof ApiError) {
        expect(error.statusCode).toBe(400)
        expect(error.errorCode).toBe('INVALID_DATA')
        expect(error.message).toBe(
          'O measure_type não foi informado ou é diferente de WATE e GAS, por favor revise os dados e tente novamente',
        )
      }
    }
  })

  it('should throw an error if customer_code is empty', async () => {
    try {
      const inputData = {
        image: 'dGVzdA==',
        datetime: '2024-09-01T12:00:00Z',
        code: '',
        type: 'WATER',
      }

      await createMeasureUseCase.execute(inputData)
    } catch (error) {
      if (error instanceof ApiError) {
        expect(error.statusCode).toBe(400)
        expect(error.errorCode).toBe('INVALID_DATA')
        expect(error.message).toBe(
          'O customer_code nao foi informado ou é invalido, por favor revise os dados e tente novamente',
        )
      }
    }
  })
})
