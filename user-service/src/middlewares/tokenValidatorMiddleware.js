import { isTokenValid } from '../utils/token.js'
import { logger, objectFormatter } from '../utils/logger.js'

const tokenValidatorMiddleware = (req, res, next) => {
  const token = req.headers.authorization

  if (token) {
    const validatedToken = isTokenValid(token)

    if (validatedToken.err) {
      logger.error({ message: validatedToken.data })
      return res.status(400).send({ errors: validatedToken.data })
    }
    logger.http({
      message: `Valid token: ${objectFormatter(validatedToken.data)}`
    })

    next()
  } else {
    logger.error({ message: 'You must provide a token' })
    return res.status(400).send({ errors: 'You must provide a token' })
  }
}

export { tokenValidatorMiddleware }
