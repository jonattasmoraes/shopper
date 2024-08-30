import express from 'express'
import bodyParser from 'body-parser'
import router from './routes'
import swaggerSetup from './swagger'

const app = express()

app.use(express.json())
app.use(bodyParser.json({ limit: '20mb' }))
app.use(router)
swaggerSetup(app)

export default app
