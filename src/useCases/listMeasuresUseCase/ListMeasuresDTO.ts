export type MeasuresDataDTO = {
  customer_code: string
  measures: MeasureDTO[]
}

export type MeasureDTO = {
  measure_uuid?: string
  measure_datetime?: Date
  measure_type?: string
  has_confirmed?: boolean
  image_url?: string
}
