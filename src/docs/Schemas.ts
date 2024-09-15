const schemas = {
  CreateInputDTO: {
    type: 'object',
    required: ['image', 'customer_code', 'measure_datetime', 'measure_type'],
    properties: {
      image: {
        type: 'string',
        description: 'The image associated with the measure',
      },
      customer_code: {
        type: 'string',
        description: 'The customer code',
      },
      measure_datetime: {
        type: 'string',
        format: 'date-time',
        description: 'The datetime of the measure',
      },
      measure_type: {
        type: 'string',
        description: 'The type of measure',
      },
    },
  },
  PatchInputDTO: {
    type: 'object',
    required: ['measure_uuid', 'confirmed_value'],
    properties: {
      measure_uuid: {
        type: 'string',
        description: 'The UUID of the measure',
      },
      confirmed_value: {
        type: 'integer',
        description: 'The confirmed value of the measure',
      },
    },
  },
  CreateOutputDTO: {
    type: 'object',
    properties: {
      image_url: {
        type: 'string',
        description: 'URL of the image',
      },
      measure_value: {
        type: 'number',
        description: 'Value of the measure',
      },
      measure_uuid: {
        type: 'string',
        description: 'UUID of the measure',
      },
    },
  },
  ErrorDTO: {
    type: 'object',
    properties: {
      error_code: {
        type: 'string',
        example: 'DOUBLE_REPORT',
      },
      error_description: {
        type: 'string',
        example: 'Reading for the month already completed',
      },
    },
  },
}

export default schemas
