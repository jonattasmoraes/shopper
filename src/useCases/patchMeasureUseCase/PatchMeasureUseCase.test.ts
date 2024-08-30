import { IMeasureRepository } from '../../domain/IMeasureRepository'
import { PatchMeasureUseCase } from './PatchMeasureUseCase'
import { PatchInputDTO } from './PatchMeasureDTO'
import { Measure } from '../../domain/Measure'

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
        measure_uuid: '9272b6a4-34ab-41f8-9dda-df8cc242abc0',
        confirmed_value: 10,
      }
      const measure = new Measure({
        measureUuid: '9272b6a4-34ab-41f8-9dda-df8cc242abc0',
        customerCode: '123',
        measureDatetime: new Date(),
        measureType: 'WATER',
        measureValue: 100,
        imageUrl: 'http://example.com/image.jpg',
        hasConfirmed: false,
      })
      measureRepository.findMeasureByUuid.mockResolvedValue(measure)
      measureRepository.confirmMeasure.mockResolvedValue()
      await useCase.execute(input)
      expect(measureRepository.findMeasureByUuid).toHaveBeenCalledWith(
        input.measure_uuid,
      )
      expect(measureRepository.confirmMeasure).toHaveBeenCalledWith(
        input.measure_uuid,
        input.confirmed_value,
      )
    })
  })
})
