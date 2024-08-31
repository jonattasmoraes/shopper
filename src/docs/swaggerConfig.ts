import swaggerDefinition from './Definition'

import swaggerJSDoc from 'swagger-jsdoc'

const options = {
  definition: swaggerDefinition,
  apis: ['./src/controllers/*.ts'],
}

const swaggerHandler = swaggerJSDoc(options)

export default swaggerHandler
