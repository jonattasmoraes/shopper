import { SendError } from '../common/errors/SendError'
import { Measure } from './Measure'

describe('Measure', () => {
  it('should create a measure with valid data', () => {
    const date = new Date()
    const measure = new Measure({
      customerCode: '1234567890',
      measureDatetime: date,
      measureType: 'WATER',
      imageUrl: 'https://example.com/image.png',
      measureValue: 10,
      hasConfirmed: false,
      measureUuid: '1234567890',
    })

    expect(measure.customerCode).toEqual('1234567890')
    expect(measure.measureDatetime).toEqual(date)
    expect(measure.measureType).toEqual('WATER')
    expect(measure.imageUrl).toEqual('https://example.com/image.png')
    expect(measure.measureValue).toEqual(10)
    expect(measure.hasConfirmed).toEqual(false)
    expect(measure.measureUuid).toEqual('1234567890')
  })

  it('should throw an error if customerCode is empty', () => {
    const date = new Date()

    expect(() => {
      new Measure({
        customerCode: '',
        measureDatetime: date,
        measureType: 'WATER',
      })
    }).toThrow(
      new SendError(
        400,
        'O customer_code nao foi informado ou é invalido, por favor revise os dados e tente novamente',
        'INVALID_DATA',
      ),
    )
  })
})
