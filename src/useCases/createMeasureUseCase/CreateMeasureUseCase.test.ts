import { CreateMeasureUseCase } from './CreateMeasureUseCase'
import { IMeasureRepository } from '../../domain/IMeasureRepository'
import { geminiProvider } from '../../config/GeminiProvider'
import { SendError } from '../../common/errors/SendError'
import { Measure } from '../../domain/Measure'

// Mocks
jest.mock('../../config/GeminiProvider')

describe('CreateMeasureUseCase', () => {
  let measureRepository: jest.Mocked<IMeasureRepository>
  let useCase: CreateMeasureUseCase

  beforeEach(() => {
    measureRepository = {
      save: jest.fn(),
      findMeasure: jest.fn(),
    } as unknown as jest.Mocked<IMeasureRepository>

    useCase = new CreateMeasureUseCase(measureRepository)
  })

  describe('Success Scenarios', () => {
    it('should create a measure successfully', async () => {
      const input = {
        customer_code: '123',
        measure_datetime: '2024-08-30 12:00:00',
        measure_type: 'GAS',
        image:
          'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAwAB/IRhC4UAAAAASUVORK5CYII=',
      }

      ;(geminiProvider as jest.Mock).mockResolvedValue({
        text: '100',
        uri: 'http://image-test.com/some-image-path',
      })

      const result = await useCase.execute(input)

      expect(result).toEqual({
        image_url: 'http://image-test.com/some-image-path',
        measure_value: 100,
        measure_uuid: result.measure_uuid,
      })

      expect(measureRepository.save).toHaveBeenCalled()
    })
  })

  describe('Error Scenarios', () => {
    it('should throw an error if measure already exists', async () => {
      const input = {
        customer_code: '123',
        measure_datetime: '2024-08-30 12:00:00',
        measure_type: 'GAS',
        image:
          'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAwAB/IRhC4UAAAAASUVORK5CYII=',
      }

      measureRepository.findMeasure.mockResolvedValue({} as Measure)

      await expect(useCase.execute(input)).rejects.toThrow(SendError)
      await expect(useCase.execute(input)).rejects.toThrow(
        'Leitura do mês já realizada',
      )
    })

    it('should throw an error if customer code is invalid', async () => {
      const input = {
        customer_code: '',
        measure_datetime: '2024-08-30 12:00:00',
        measure_type: 'GAS',
        image:
          'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAwAB/IRhC4UAAAAASUVORK5CYII=',
      }

      await expect(useCase.execute(input)).rejects.toThrow(SendError)
      await expect(useCase.execute(input)).rejects.toThrow(
        'O customer_code nao foi informado ou é invalido, por favor revise os dados e tente novamente',
      )
    })

    it('should throw an error if measure_datetime is invalid', async () => {
      const invalidDates = [
        '2024-083-30 12:00:00', // Mês inválido
        '2024-08-32 12:00:00', // Dia inválido
        '2024-08-30 25:00:00', // Hora inválida
        '2024-08-30 12:60:00', // Minuto inválido
        '2024-08-30 12:00:60', // Segundo inválido
        '2024-02-30 12:00:00', // Data inválida
        '', // Data vazia
        'not-a-date', // Valor não relacionado a data
      ]

      for (const invalidDate of invalidDates) {
        await expect(
          useCase.execute({
            customer_code: '1234',
            measure_datetime: invalidDate,
            measure_type: 'GAS',
            image:
              'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAwAB/IRhC4UAAAAASUVORK5CYII=',
          }),
        ).rejects.toThrow(SendError)

        await expect(
          useCase.execute({
            customer_code: '1234',
            measure_datetime: invalidDate,
            measure_type: 'GAS',
            image:
              'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAwAB/IRhC4UAAAAASUVORK5CYII=',
          }),
        ).rejects.toThrow(
          'O measure_datetime não foi informado ou é inválido, por favor revise os dados e tente novamente',
        )
      }
    })

    it('should throw an error if measure_type is invalid', async () => {
      const input = {
        customer_code: '12345',
        measure_datetime: '2024-08-30 12:00:00',
        measure_type: 'INVALID_TYPE',
        image:
          'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAwAB/IRhC4UAAAAASUVORK5CYII=',
      }

      await expect(useCase.execute(input)).rejects.toThrow(SendError)
      await expect(useCase.execute(input)).rejects.toThrow(
        'O measure_type não foi informado ou é invalido por ser diferente de "WATER" ou "GAS", por favor revise os dados e tente novamente',
      )
    })

    it('should throw an error if image is empty or invalid', async () => {
      const invalidImages = [
        '', // Imagem vazia
        'not-a-base64', // Não é uma string base64
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAwAB/IRhC4UAAAAASUVORK5CYI', // Imagem base64 inválida (incompleta)
      ]

      for (const invalidImage of invalidImages) {
        await expect(
          useCase.execute({
            customer_code: '1234',
            measure_datetime: '2024-08-30 12:00:00',
            measure_type: 'GAS',
            image: invalidImage,
          }),
        ).rejects.toThrow(
          'A imagem é obrigatória e deve ser uma imagem base64, por favor revise os dados e tente novamente',
        )
      }
    })
  })
})
