export type CreateInputDto = {
  image: string
  customer_code: string
  measure_datetime: string
  measure_type: string
}

export type CreateOutputDto = {
  image_url?: string
  measure_value?: number
  measure_uuid?: string
}

export type PatchInputDto = {
  id: string
  value: number
}

export type ListMeasuresDto = {
  customer_code: string
  measures: MeasureDto[]
}

export type MeasureDto = {
  measure_uuid?: string
  measure_datetime?: Date
  measure_type?: string
  has_confirmed?: boolean
  image_url?: string
}
