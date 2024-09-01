import { PatchMeasureUseCase } from './PatchMeasureUseCase'
import { PatchInputDTO } from '../patchMeasureUseCase/PatchMeasureDTO'
import { IMeasureRepository } from '../../repositories/IMeasureRepository'
import { Measure } from '../../entities/Measure'

jest.mock('../../common/errors/SendError')
jest.mock('../../domain/IMeasureRepository')

describe('PatchMeasureUseCase', () => {
  let useCase: PatchMeasureUseCase
  let measureRepository: jest.Mocked<IMeasureRepository>

  beforeEach(() => {
    measureRepository = {
      findMeasureByUuid: jest.fn(),
      confirmMeasure: jest.fn(),
    } as unknown as jest.Mocked<IMeasureRepository>

    useCase = new PatchMeasureUseCase(measureRepository)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('execute', () => {
    it('should confirm a measure', async () => {
      const input: PatchInputDTO = {
        id: '9272b6a4-34ab-41f8-9dda-df8cc242abc0',
        value: 10,
      }
      const measure = Measure.create('123', 'WATER', new Date())

      measureRepository.findById.mockResolvedValue(measure)
      measureRepository.confirm.mockResolvedValue()
      await useCase.execute(input)
      expect(measureRepository.findById).toHaveBeenCalledWith(input.id)
      expect(measureRepository.confirm).toHaveBeenCalledWith(
        input.id,
        input.value,
      )
    })
  })
})
