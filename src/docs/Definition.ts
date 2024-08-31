import Schemas from './schemas'
import Responses from './responses'

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Back-End Service for Water and Gas Consumption Management',
    version: '1.0.0',
    description:
      'This back-end service is responsible for managing individual water and gas consumption readings. Using AI to obtain measurements from meter images.',
  },
  components: {
    schemas: Schemas,
    responses: Responses,
  },
}

export default swaggerDefinition
