import express from 'express'
import './database/dbConnection.js'
import { rootRouter } from './routes/index.js'
import { logger } from './utils/logger.js'
import redis from 'redis'

const app = express()
app.use(express.json())

app.use('/api', rootRouter)

export const redisClient = redis.createClient({
  url: process.env.REDIS_URI
})

const port = process.env.PORT || 3000
app.listen(port, () => {
  logger.info(`user-service listening on port ${port}`)
  redisClient.connect()
})

redisClient.on('connect', () =>
  logger.info('Redis client connected successfully')
)

redisClient.on('error', (err) =>
  logger.error(`Redis client connection error: ${err}`)
)
