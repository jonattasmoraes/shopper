export type CreateInputDto = {
  image: string
  code: string
  datetime: string
  type: string
}

export type CreateOutputDto = {
  image_url: string
  measure_value: number
  measure_uuid: string
}

export type ListMeasuresDto = {
  customer_code: string
  measures: MeasureDto[]
}

export type MeasureDto = {
  measure_uuid: string
  measure_datetime: Date
  measure_type: string
  has_confirmed: boolean
  image_url: string
}
