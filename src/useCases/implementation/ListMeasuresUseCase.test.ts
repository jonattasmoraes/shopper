import { InMemoryMeasureRepository } from '../../repositories/in-memory/MeasureInMemoryRepository'
import { ListMeasuresUseCase } from './ListMeasuresUseCase'
import { Measure } from '../../entities/Measure'
import { ApiError } from '../../common/errors/ApiError'

describe('List Measures Use Case', () => {
  let repository: InMemoryMeasureRepository
  let listUseCase: ListMeasuresUseCase

  beforeEach(() => {
    repository = InMemoryMeasureRepository.build()
    listUseCase = ListMeasuresUseCase.build(repository)
  })

  it('should list all measures', async () => {
    const date = new Date()
    const measure = Measure.create('CUSTOMER', 'WATER', date)
    const otherMeasure = Measure.create('CUSTOMER', 'GAS', date)

    await repository.save(measure)
    await repository.save(otherMeasure)

    const result = await listUseCase.repository.list(measure.customerCode)

    if (!result) throw new Error()

    expect(result).toContainEqual(measure)
    const types = result.map((measure) => measure.props.type)
    expect(types).toContain('WATER')
    expect(types).toContain('GAS')
    expect(result).toHaveLength(2)
  })

  it('should list only a specific type of measures', async () => {
    const date = new Date()
    const type = 'WATER'
    const measure = Measure.create('CUSTOMER', 'WATER', date)
    const otherMeasure = Measure.create('CUSTOMER', 'WATER', date)
    const otherMeasureAgain = Measure.create('CUSTOMER', 'GAS', date)

    await repository.save(measure)
    await repository.save(otherMeasure)
    await repository.save(otherMeasureAgain)

    const result = await listUseCase.repository.list(measure.customerCode, type)

    if (!result) throw new Error()

    expect(result).toContainEqual(measure)
    const types = result.map((measure) => measure.props.type)
    expect(types).toContain('WATER')
    expect(types).not.toContain('GAS')
    expect(result).toHaveLength(2)
  })

  it('should throw an error if type is different than "WATER" or "GAS"', async () => {
    const customerCode = '123'
    const invalidType = 'invalid'
    try {
      await listUseCase.execute(customerCode, invalidType)
    } catch (error) {
      if (error instanceof ApiError) {
        expect(error.statusCode).toBe(400)
        expect(error.errorCode).toBe('INVALID_TYPE')
        expect(error.message).toBe('Tipo de medição não permitida')
      }
    }
  })

  it('should throw an error if no measures are found', async () => {
    const customerCode = 'CUSTOMER'
    const type = 'WATER'
    try {
      await listUseCase.execute(customerCode, type)
    } catch (error) {
      if (error instanceof ApiError) {
        expect(error.statusCode).toBe(404)
        expect(error.errorCode).toBe('MEASURES_NOT_FOUND')
        expect(error.message).toBe('Nenhuma leitura encontrada')
      }
    }
  })
})
