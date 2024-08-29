import { v4 as uuid } from 'uuid'
import moment from 'moment'
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

  const formattedDate = dateValidator(props.measureDatetime?.toString())
  if (!formattedDate) {
    throw new SendError(
      400,
      'O measure_datetime não foi informado ou é invalido, por favor revise os dados e tente novamente',
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

function dateValidator(input: string): string | false {
  // List of possible date formats
  const formats = [
    'YYYY-MM-DD', // year-month-day
    'DD-MM-YYYY', // day-month-year
    'DD/MM/YYYY', // day/month/year
    'MM/DD/YYYY', // month/day/year
    'YYYY-MM-DD HH:mm:ss', // year-month-day hour:minute:second
    'DD/MM/YYYY HH:mm:ss', // day-month-year hour:minute:second
    'MM/DD/YYYY HH:mm:ss', // month-day-year hour:minute:second
    'YYYY-MM-DDTHH:mm:ssZ', // ISO format with Z for UTC
    'YYYY-MM-DDTHH:mm:ss.SSSZ', // ISO format with milliseconds
    'YYYY/MM/DD', // year/month/day
    'YYYY.MM.DD', // year.month.day
    'DD.MM.YYYY', // day.month.year
    'DD-MMM-YYYY', // day-month name-year
    'DD/MM/YYYY HH:mm', // day/month/year hour:minute
    'MM/DD/YYYY HH:mm', // month/day/year hour:minute
  ]

  // Verify if the input matches any of the possible formats
  for (const fmt of formats) {
    const date = moment(input, fmt, true)
    if (date.isValid()) {
      return date.format('YYYY-MM-DDTHH:mm:ssZ')
    }
  }

  // If none of the formats match, return false
  return false
}
