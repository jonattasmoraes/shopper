import { v4 as uuid } from 'uuid'
import moment from 'moment'
import { ClientError } from '../common/errors/BaseError'

type MeasureProps = {
  id: string
  customerCode: string
  dataTime: Date
  type: string
  imageUrl: string
  value: number
  hasConfirmed: boolean
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
      throw new ClientError(
        400,
        'O customer_code nao foi informado ou é invalido, por favor revise os dados e tente novamente',
        'INVALID_DATA',
      )
    }

    if (!type || (type !== 'WATER' && type !== 'GAS')) {
      throw new ClientError(
        400,
        'O measure_type não foi informado ou é diferente de WATE e GAS, por favor revise os dados e tente novamente',
        'INVALID_TYPE',
      )
    }

    if (!dataTime || !moment(dataTime).isValid()) {
      throw new ClientError(
        400,
        'O measure_datetime não foi informado ou é inválido, por favor revise os dados e tente novamente',
        'INVALID_DATA',
      )
    }
  }

  public get id() {
    return this.props.id
  }

  public get customerCode() {
    return this.props.customerCode
  }

  public get dataTime() {
    return this.props.dataTime
  }

  public get type() {
    return this.props.type
  }

  public get imageUrl() {
    return this.props.imageUrl
  }

  public set imageUrl(imageUrl: string) {
    this.props.imageUrl = imageUrl
  }

  public get value() {
    return this.props.value
  }

  public set value(value: number) {
    if (!Number.isInteger(value) || value <= 0) {
      throw new ClientError(
        400,
        'O confirmed_value deve ser um número inteiro e maior que 0. Por favor, revise os dados e tente novamente.',
        'INVALID_DATA',
      )
    }
    this.props.value = value
  }

  public get hasConfirmed() {
    return this.props.hasConfirmed
  }
}
