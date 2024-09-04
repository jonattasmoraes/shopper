import express from 'express'
import bodyParser from 'body-parser'
import router from './routes'
import { errorMiddleware } from './middlewares/Error'

const app = express()

app.use(express.json())
app.use(bodyParser.json({ limit: '20mb' }))
app.use(router)
app.use(errorMiddleware)

export default app
