import { ApiError } from '../common/errors/ApiError'
import { Measure } from './Measure'

describe('Measure Creation', () => {
  const validDate = new Date()
  const invalidDateString = new Date('2024-083-30 12:00:00')
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
    try {
      Measure.create('', 'GAS', new Date())
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

  it('should throw an error if measureType is different from "WATER" or "GAS"', () => {
    try {
      Measure.create('CUSTOMER', 'INVALID_TYPE', new Date())
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

  it('should throw an error if measureType is empty', () => {
    try {
      Measure.create('CUSTOMER', '', new Date())
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

  it('should throw an error if measureType is in lowercase', () => {
    try {
      Measure.create('CUSTOMER', 'water', new Date())
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

  it('should throw an error if measureDatetime is invalid', () => {
    try {
      Measure.create('CUSTOMER', 'WATER', invalidDateString)
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

  it('should throw an error if measureDatetime is empty', () => {
    const invalidDate = new Date('')
    try {
      Measure.create('CUSTOMER', 'WATER', invalidDate)
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

  it('should throw an error if value is less than or equal to 0', () => {
    const measure = Measure.create('CUSTOMER', 'WATER', new Date())

    try {
      measure.value = 0
    } catch (error) {
      if (error instanceof ApiError) {
        expect(error.message).toBe(
          'O confirmed_value deve ser um número inteiro e maior que 0. Por favor, revise os dados e tente novamente.',
        )
      }
    }

    try {
      measure.value = -1
    } catch (error) {
      if (error instanceof ApiError) {
        expect(error.message).toBe(
          'O confirmed_value deve ser um número inteiro e maior que 0. Por favor, revise os dados e tente novamente.',
        )
      }
    }
  })
})
