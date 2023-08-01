import User from '../models/userModel.js'
import { logger } from '../utils/logger.js'

const createSeller = async (req, res) => {
  const prefix = 'createSeller'

  try {
    logger.http({ prefix, message: 'Request incoming...' })

    const { email } = req.body

    const user = await User.findOne({ email: email })
    if (user) {
      logger.error({ prefix, message: 'User already exists' })
      return res.status(400).send({ errors: 'User already exists' })
    }

    const newUser = new User({ ...req.body, role: 'seller' })
    logger.http({
      prefix,
      message: `Creating user with body: ${objectFormatter(req.body)}`
    })
    await newUser.save()

    logger.http({ prefix, message: `user created successfully: ${newUser}` })
    logger.http({ prefix, message: 'Request finished...' })

    res.json(newUser)
  } catch (err) {
    logger.error({ prefix, messager: err.message })
    return res.json({ errors: 'Something went wrong' })
  }
}

export { createSeller }
