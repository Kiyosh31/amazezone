import express from 'express'
import './database/dbConnection.js'
import { rootRouter } from './routes/index.js'
import { logger } from './utils/logger.js'
import redis from 'redis'

const app = express()
app.use(express.json())

app.use('/api/user', rootRouter)

export const redisClient = redis.createClient({
  url: process.env.REDIS_URI
})

const port = process.env.PORT || 3000

redisClient.connect()

redisClient.on('error', (err) =>
  logger.error(`[user-service] => Redis client connection error: ${err}`)
)

redisClient.on('connect', () =>
  logger.info('[user-service] => Redis client connected successfully')
)

app.listen(port, () => logger.info(`[user-service] listening on port ${port}`))
