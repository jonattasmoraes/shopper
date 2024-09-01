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
    const measure = new Measure({
      id: uuid(),
      customerCode,
      dataTime,
      type,
      imageUrl: '',
      value: 0,
      hasConfirmed: false,
    })

    measure.createValidator()

    return measure
  }

  private createValidator() {
    if (!this.customerCode || typeof this.customerCode !== 'string') {
      throw new SendError(
        400,
        'O customer_code nao foi informado ou é invalido, por favor revise os dados e tente novamente',
        'INVALID_DATA',
      )
    }

    if (!this.type || (this.type !== 'WATER' && this.type !== 'GAS')) {
      throw new SendError(
        400,
        'INVALID_TYPE',
        'O measure_type não foi informado ou é diferente de WATE e GAS, por favor revise os dados e tente novamente',
      )
    }

    if (!this.dataTime || !moment(this.dataTime).isValid()) {
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

  get value() {
    return this.props.value
  }

  get hasConfirmed() {
    return this.props.hasConfirmed
  }
}
