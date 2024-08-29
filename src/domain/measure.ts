import { v4 as uuid } from 'uuid'
import { SendError } from '../common/errors/SendError'

export type MeasureType = 'WATER' | 'GAS'

export class Measure {
  public measureUuid?: string
  public customerCode: string
  public measureDatetime: string
  public measureValue?: number
  public measureType: MeasureType
  public hasConfirmed?: boolean
  public imageUrl?: string
  public confirmedValue?: number

  constructor(props: Measure) {
    this.measureUuid = uuid()

    this.customerCode = props.customerCode
    this.measureValue = props.measureValue
    this.measureDatetime = props.measureDatetime
    this.measureType = props.measureType
    this.imageUrl = props.imageUrl
    this.hasConfirmed = false

    validate(props)
  }
}

function validate(props: Measure): void {
  if (!props.customerCode || typeof props.customerCode !== 'string') {
    throw new SendError(
      400,
      'O customer_code nao foi informado ou é invalido, por favor revise os dados e tente novamente',
      'INVALID_DATA',
    )
  }

  if (!props.measureType || !['WATER', 'GAS'].includes(props.measureType)) {
    throw new SendError(
      400,
      'O measure_type não foi informado ou é invalido por ser diferente de "WATER" ou "GAS", por favor revise os dados e tente novamente',
      'INVALID_DATA',
    )
  }
}
