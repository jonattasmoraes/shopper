import { v4 as uuid } from 'uuid'
import moment from 'moment'
import { SendError } from '../common/errors/SendError'

type MeasureProps = {
  id: string
  customerCode: string
  dataTime: Date
  type: string
  imageUrl: string
  value: number
  hasConfirmed: boolean
  confirmedValue?: number
}

export class Measure {
  private constructor(readonly props: MeasureProps) {}

  static create(customerCode: string, type: string, dataTime: Date) {
    this.validator(customerCode, type, dataTime)
    const measure = new Measure({
      id: uuid(),
      customerCode,
      dataTime,
      type,
      imageUrl: '',
      value: 0,
      hasConfirmed: false,
    })
    return measure
  }

  static with(
    id: string,
    customerCode: string,
    type: string,
    dataTime: Date,
    imageUrl: string,
    value: number,
    hasConfirmed: boolean,
  ) {
    const measure = new Measure({
      id,
      customerCode,
      dataTime,
      type,
      imageUrl,
      value,
      hasConfirmed,
    })

    return measure
  }

  static validator(customerCode: string, type: string, dataTime: Date) {
    if (!customerCode || typeof customerCode !== 'string') {
      throw new SendError(
        400,
        'O customer_code nao foi informado ou é invalido, por favor revise os dados e tente novamente',
        'INVALID_DATA',
      )
    }

    if (!type || (type !== 'WATER' && type !== 'GAS')) {
      throw new SendError(
        400,
        'INVALID_TYPE',
        'O measure_type não foi informado ou é diferente de WATE e GAS, por favor revise os dados e tente novamente',
      )
    }

    if (!dataTime || !moment(dataTime).isValid()) {
      throw new SendError(
        400,
        'O measure_datetime não foi informado ou é inválido, por favor revise os dados e tente novamente',
        'INVALID_DATA',
      )
    }
  }

  get id() {
    return this.props.id
  }

  get customerCode() {
    return this.props.customerCode
  }

  get dataTime() {
    return this.props.dataTime
  }

  get type() {
    return this.props.type
  }

  get imageUrl() {
    return this.props.imageUrl
  }

  set imageUrl(imageUrl: string) {
    this.props.imageUrl = imageUrl
  }

  get value() {
    return this.props.value
  }

  set value(value: number) {
    this.props.value = value
  }

  get hasConfirmed() {
    return this.props.hasConfirmed
  }
}
