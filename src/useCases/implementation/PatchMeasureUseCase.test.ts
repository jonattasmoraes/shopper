import { expectClientError } from '../../common/utils/ErrorValidator'
import { Measure } from '../../entities/Measure'
import { InMemoryMeasureRepository } from '../../repositories/in-memory/MeasureInMemoryRepository'
import { PatchMeasureUseCase } from './PatchMeasureUseCase'

describe('Create Measure Use Case', () => {
  let repository: InMemoryMeasureRepository
  let patchUseCase: PatchMeasureUseCase

  beforeEach(() => {
    repository = InMemoryMeasureRepository.build()
    patchUseCase = PatchMeasureUseCase.build(repository)
  })

  it('should confirm a measure', async () => {
    const measure = Measure.create('CUSTOMER', 'WATER', new Date())
    await repository.save(measure)

    await patchUseCase.execute(measure.id, 10)

    const updatedMeasure = await repository.findById(measure.id)
    expect(updatedMeasure).toBeDefined()
    expect(updatedMeasure!.value).toBe(10)
    expect(updatedMeasure!.hasConfirmed).toBe(true)
  })

  it('should throw an error if measure ID is invalid', async () => {
    return expectClientError(
      patchUseCase.execute('invalid_id', 10),
      400,
      'INVALID_DATA',
      'O measure_uuid informado é inválido. Por favor, revise os dados e tente novamente.',
    )
  })

  it('should throw an error if id is not empty', async () => {
    return expectClientError(
      patchUseCase.execute('', 10),
      400,
      'INVALID_DATA',
      'O measure_uuid informado é inválido. Por favor, revise os dados e tente novamente.',
    )
  })

  it('should throw an error if value is zero', async () => {
    return expectClientError(
      patchUseCase.execute('invalid_id', 0),
      400,
      'INVALID_DATA',
      'O measure_uuid informado é inválido. Por favor, revise os dados e tente novamente.',
    )
  })

  it('should throw an error if value is negative', async () => {
    return expectClientError(
      patchUseCase.execute('invalid_id', -10),
      400,
      'INVALID_DATA',
      'O measure_uuid informado é inválido. Por favor, revise os dados e tente novamente.',
    )
  })
})
