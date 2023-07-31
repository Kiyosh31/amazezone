import mongoose from 'mongoose'
import { logger } from '../utils/logger.js'

const MONGO_URI = process.env.MONGO_URI

export default mongoose
  .connect(MONGO_URI, {})
  .then(() => {
    logger.info({
      message: 'Connected to DB!'
    })
  })
  .catch((err) => {
    logger.error({
      message: `Error connecting to MongoDB: URI: ${MONGO_URI} Error: ${err.message}`
    })
  })
