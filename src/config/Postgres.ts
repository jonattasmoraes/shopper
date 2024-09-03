import { Pool } from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const DB_CONNECTION_STRING = process.env.DATABASE_URL

const db = new Pool({
  connectionString: DB_CONNECTION_STRING,
})

export { db }
