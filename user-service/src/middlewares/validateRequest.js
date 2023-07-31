import { validationResult } from 'express-validator'
import { logger, objectFormatter } from '../utils/logger.js'

export const validateRequest = (req, res, next) => {
  const errors = validationResult(req)
  const msg = 'Some props are wrong'

  if (!errors.isEmpty()) {
    logger.error({
      message: msg,
      data: objectFormatter(errors.array())
    })

    res.status(400).send({ errors: errors.array() })
  }

  next()
}
