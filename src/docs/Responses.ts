const responses = {
  ConflictError: {
    description: 'Conflict error due to request',
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/ErrorDTO',
        },
      },
    },
  },
  InternalServerError: {
    description: 'Internal server error',
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/ErrorDTO',
        },
      },
    },
  },
}

export default responses
