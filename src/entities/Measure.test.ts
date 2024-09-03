import { expectClientErrorSync } from '../common/utils/ErrorValidator'
import { Measure } from './Measure'

describe('Measure Creation', () => {
  const validDate = new Date()
  const invalidDateString = '2024-083-30 12:00:00'
  const validCustomerCode = 'CUSTOMER'
  const validMeasureType = 'WATER'

  it('should create a measure with valid data', () => {
    const measure = Measure.create(validCustomerCode, validMeasureType, validDate)

    expect(measure).toHaveProperty('id')
    expect(measure.dataTime).toEqual(validDate)
    expect(measure.customerCode).toEqual(validCustomerCode)
    expect(measure.type).toEqual(validMeasureType)
    expect(measure.imageUrl).toEqual('')
    expect(measure.value).toEqual(0)
    expect(measure.hasConfirmed).toEqual(false)
  })

  it('should throw an error if customerCode is empty', () => {
    expectClientErrorSync(
      () => Measure.create('', 'WATER', new Date()),
      400,
      'INVALID_DATA',
      'O customer_code nao foi informado ou é invalido, por favor revise os dados e tente novamente',
    )
  })

  it('should throw an error if measureType is different from "WATER" or "GAS"', () => {
    expectClientErrorSync(
      () => Measure.create('CUSTOMER', 'INVALID_TYPE', new Date()),
      400,
      'INVALID_DATA',
      'O measure_type não foi informado ou é diferente de WATE e GAS, por favor revise os dados e tente novamente',
    )
  })

  it('should throw an error if measureType is empty', () => {
    expectClientErrorSync(
      () => Measure.create('CUSTOMER', '', new Date()),
      400,
      'INVALID_DATA',
      'O measure_type não foi informado ou é diferente de WATE e GAS, por favor revise os dados e tente novamente',
    )
  })

  it('should throw an error if measureType is in lowercase', () => {
    expectClientErrorSync(
      () => Measure.create('CUSTOMER', 'water', new Date()),
      400,
      'INVALID_DATA',
      'O measure_type não foi informado ou é diferente de WATE e GAS, por favor revise os dados e tente novamente',
    )
  })

  it('should throw an error if measureDatetime is invalid', () => {
    const invalidDate = new Date(invalidDateString)
    expectClientErrorSync(
      () => Measure.create('CUSTOMER', 'WATER', invalidDate),
      400,
      'INVALID_DATA',
      'O measure_datetime não foi informado ou é inválido, por favor revise os dados e tente novamente',
    )
  })

  it('should throw an error if measureDatetime is empty', () => {
    const invalidDate = new Date('')
    expectClientErrorSync(
      () => Measure.create('CUSTOMER', 'WATER', invalidDate),
      400,
      'INVALID_DATA',
      'O measure_datetime não foi informado ou é inválido, por favor revise os dados e tente novamente',
    )
  })

  it('should throw an error if value is less than or equal to 0', () => {
    const measure = Measure.create('CUSTOMER', 'WATER', new Date())

    expectClientErrorSync(
      () => {
        measure.value = 0
      },
      400,
      'INVALID_DATA',
      'O confirmed_value deve ser um número inteiro e maior que 0. Por favor, revise os dados e tente novamente.',
    )

    expectClientErrorSync(
      () => {
        measure.value = 0
      },
      400,
      'INVALID_DATA',
      'O confirmed_value deve ser um número inteiro e maior que 0. Por favor, revise os dados e tente novamente.',
    )
  })
})
