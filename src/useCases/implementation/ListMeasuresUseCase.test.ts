import { ListMeasuresUseCase } from './ListMeasuresUseCase'
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

  it('should throw an error if the repository throws an error', async () => {
    const code = '123'
    const type = 'WATER'

    listMeasureRepository.list.mockRejectedValue(new Error('Repository error'))

    await expect(useCase.execute(code, type)).rejects.toThrow('Repository error')
  })
})
