import { SendError } from '../common/errors/SendError'
import { Measure } from './Measure'

describe('Measure', () => {
  it('should create a measure with valid data', () => {
    const date = new Date()
    const measure = Measure.create('CUSTOMER', 'WATER', date)

    expect(measure.customerCode).toEqual('CUSTOMER')
    expect(measure.dataTime).toEqual(date)
    expect(measure.type).toEqual('WATER')
  })

  it('should throw an error if customerCode is empty', () => {
    const date = new Date()

    expect(() => {
      Measure.create('', 'WATER', date)
    }).toThrow(
      new SendError(
        400,
        'O customer_code nao foi informado ou é invalido, por favor revise os dados e tente novamente',
        'INVALID_DATA',
      ),
    )
  })
})
