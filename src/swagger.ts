import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import { Express } from 'express'

// Swagger definition
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API Documentation',
    version: '1.0.0',
    description: 'API documentation for the measures service',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Development server',
    },
  ],
  components: {
    schemas: {
      CreateInputDTO: {
        type: 'object',
        required: [
          'image',
          'customer_code',
          'measure_datetime',
          'measure_type',
        ],
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
            description: 'The image associated with the measure',
          },
          confirmed_value: {
            type: 'integer',
            description: 'The customer code',
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
            example: 'Leitura do mês já realizada',
          },
        },
      },
    },
    responses: {
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
    },
  },
}

const options = {
  definition: swaggerDefinition,
  apis: ['./src/controllers/*.ts'],
}

const specs = swaggerJSDoc(options)

const swaggerSetup = (app: Express) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs))
}

export default swaggerSetup
