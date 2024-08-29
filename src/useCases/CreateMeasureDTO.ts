import { MeasureType } from '../domain/Measure'

export type CreateInputDTO = {
  image: string
  customer_code: string
  measure_datetime: string
  measure_type: MeasureType
}

export type CreateOutputDTO = {
  image_url?: string
  measure_value?: number
  measure_uuid?: string
}
