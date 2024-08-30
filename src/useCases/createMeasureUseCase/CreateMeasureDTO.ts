export type CreateInputDTO = {
  image: string
  customer_code: string
  measure_datetime: string
  measure_type: string
}

export type CreateOutputDTO = {
  image_url?: string
  measure_value?: number
  measure_uuid?: string
}
