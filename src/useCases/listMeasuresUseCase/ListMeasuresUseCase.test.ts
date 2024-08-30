import { IMeasureRepository } from '../../domain/IMeasureRepository'
import { Measure } from '../../domain/Measure'
import { ListMeasuresUseCase } from './ListMeasuresUseCase'
import { MeasureDTO } from './ListMeasuresDTO'

jest.mock('../../common/errors/SendError')
jest.mock('../../domain/IMeasureRepository')

describe('ListMeasuresUseCase', () => {
  let useCase: ListMeasuresUseCase
  let listMeasureRepository: jest.Mocked<IMeasureRepository>

  beforeEach(() => {
    listMeasureRepository = {
      listMeasures: jest.fn(),
    } as unknown as jest.Mocked<IMeasureRepository>

    useCase = new ListMeasuresUseCase(listMeasureRepository)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('execute', () => {
    it('should return measures data if type is valid', async () => {
      const code = '123'
      const type = 'WATER'
      const measures = [
        new Measure({
          measureUuid: '9272b6a4-34ab-41f8-9dda-df8cc242abc0',
          customerCode: code,
          measureDatetime: new Date(),
          measureType: type,
          measureValue: 100,
          imageUrl: 'http://example.com/image.jpg',
          hasConfirmed: true,
        }),
      ]

      const expectedDTOs: MeasureDTO[] = measures.map((measure) => ({
        measure_uuid: measure.measureUuid,
        measure_datetime: measure.measureDatetime,
        measure_type: measure.measureType,
        has_confirmed: measure.hasConfirmed,
        image_url: measure.imageUrl,
      }))

      listMeasureRepository.listMeasures.mockResolvedValue(measures)

      const result = await useCase.execute(code, type)

      expect(result).toEqual({
        customer_code: code,
        measures: expectedDTOs,
      })
      expect(listMeasureRepository.listMeasures).toHaveBeenCalledWith(
        code,
        type,
      )
    })

    it('should throw an error if the repository throws an error', async () => {
      const code = '123'
      const type = 'WATER'

      listMeasureRepository.listMeasures.mockRejectedValue(
        new Error('Repository error'),
      )

      await expect(useCase.execute(code, type)).rejects.toThrow(
        'Repository error',
      )
    })
  })
})
