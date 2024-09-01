import { Measure } from '../../entities/Measure'
import { ListMeasuresUseCase } from './ListMeasuresUseCase'
import { MeasureDTO } from '../listMeasuresUseCase/ListMeasuresDTO'
import { IMeasureRepository } from '../../repositories/IMeasureRepository'

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
      const measures = [Measure.create('123', 'WATER', new Date())]

      const expectedDTOs: MeasureDTO[] = measures.map((measure) => ({
        id: measure.id,
        has_confirmed: measure.hasConfirmed,
        image_url: measure.imageUrl,
      }))

      listMeasureRepository.list.mockResolvedValue(measures)

      const result = await useCase.execute(code, type)

      expect(result).toEqual({
        customer_code: code,
        measures: expectedDTOs,
      })
      expect(listMeasureRepository.list).toHaveBeenCalledWith(code, type)
    })

    it('should throw an error if the repository throws an error', async () => {
      const code = '123'
      const type = 'WATER'

      listMeasureRepository.list.mockRejectedValue(
        new Error('Repository error'),
      )

      await expect(useCase.execute(code, type)).rejects.toThrow(
        'Repository error',
      )
    })
  })
})
