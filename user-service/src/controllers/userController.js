import User from '../models/userModel.js'
import { logger, objectFormatter } from '../utils/logger.js'
import Password from '../utils/password.js'
import { isTokenValid, createToken } from '../utils/token.js'
import mongoose from 'mongoose'
// import { transformJSONToRedis, transformRedisToJSON } from '../utils/redis.js'
// import { redisClient } from '../index.js'

const getUser = async (req, res) => {
  const prefix = 'getUser'

  try {
    logger.http({ prefix, message: 'Request incoming...' })

    const { id } = req.params

    logger.http({ prefix, message: `Searching user with id: ${id}` })

    logger.http({
      prefix,
      message: 'Searching for user'
    })

    // const redisFindedUser = await redisClient.get(`user?id=${id}`)

    // if (redisFindedUser) {
    //   logger.http({
    //     prefix,
    //     message: `${RESPONSE_TYPES.USER_FOUND_IN_REDIS} ${redisFindedUser}`
    //   })
    //   logger.http({ prefix, message: RESPONSE_TYPES.REQUEST_FINISHED })

    //   res.json(transformRedisToJSON(redisFindedUser))
    // } else {
    const mongoFindedUser = await User.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(id) }
      },
      {
        $lookup: {
          from: 'cards',
          localField: '_id',
          foreignField: 'userId',
          as: 'cards'
        }
      },
      {
        $lookup: {
          from: 'addresses',
          localField: '_id',
          foreignField: 'userId',
          as: 'addresses'
        }
      }
    ])

    if (!mongoFindedUser || mongoFindedUser.length === 0) {
      logger.error({ prefix, message: 'User not found' })
      return res.status(400).json({ errors: 'User not found' })
    }

    // await redisClient.set(
    //   `user?id=${id}`,
    //   transformJSONToRedis(mongoFindedUser)
    // )
    logger.http({
      prefix,
      message: `User found in database: ${objectFormatter(mongoFindedUser)}`
    })
    logger.http({ prefix, message: 'Request finished...' })
    res.json(mongoFindedUser)
    // }
  } catch (err) {
    logger.error({ prefix, message: err.message })
    return res.json({ errors: 'Something went wrong' })
  }
}

const getAllUsers = async (req, res) => {
  const prefix = 'getAllUsers'

  try {
    logger.http({ prefix, message: 'Request incoming...' })

    const validatedToken = isTokenValid(req.headers.authorization)
    if (validatedToken.err) {
      logger.error({ prefix, message: validatedToken.data })
      return res.status(400).send({ errors: validatedToken.data })
    }
    logger.http({
      prefix,
      message: `Valid token: ${objectFormatter(validatedToken.data)}`
    })

    // const usersInRedis = await redisClient.get('allUsers')

    logger.http({ prefix, message: 'Searching for all users' })
    // if (usersInRedis) {
    //   logger.http({
    //     prefix,
    //     message: `${RESPONSE_TYPES.USER_FOUND_IN_REDIS} ${usersInRedis}`
    //   })
    //   logger.http({ prefix, message: RESPONSE_TYPES.REQUEST_FINISHED })

    //   res.json(transformRedisToJSON(usersInRedis))
    // } else {
    const usersInMongo = await User.find({})

    if (!usersInMongo || usersInMongo.length === 0) {
      logger.error({ prefix, message: 'No users found' })
      return res.status(400).send({ errors: 'No users found' })
    }

    // await redisClient.set(`allUsers`, transformJSONToRedis(usersInMongo))

    logger.http({
      prefix,
      message: `User found in database: ${usersInMongo}`
    })
    logger.http({ prefix, message: 'Request finished...' })

    res.json(usersInMongo)
    // }
  } catch (err) {
    logger.error({ prefix, message: err.message })
    return res.json({ errors: 'Something went wrong' })
  }
}

const createUser = async (req, res) => {
  const prefix = 'createUser'

  try {
    logger.http({ prefix, message: 'Request incoming...' })

    const { email } = req.body

    const user = await User.findOne({ email: email })
    if (user) {
      logger.error({ prefix, message: 'User already exists' })
      return res.status(400).send({ errors: 'User already exists' })
    }

    const newUser = new User({ ...req.body, role: 'user' })
    logger.http({
      prefix,
      message: `Creating user with body: ${objectFormatter(req.body)}`
    })
    await newUser.save()

    logger.http({ prefix, message: `user created successfully: ${newUser}` })
    logger.http({ prefix, message: 'Request finished...' })

    res.json(newUser)
  } catch (err) {
    logger.error({ prefix, message: err.message })
    return res.json({ errors: 'Something went wrong' })
  }
}

const updateUser = async (req, res) => {
  const prefix = 'updateUser'
  try {
    logger.http({ prefix, message: 'Request incoming...' })

    const { id } = req.params
    logger.http({ prefix, message: `Searching for user with id: ${id}` })

    const findedUser = await User.findOne({ _id: id })
    if (!findedUser) {
      logger.error({ prefix, message: 'User not found' })
      return res.status(400).json({ errors: 'User not found' })
    }

    logger.http({
      prefix,
      message: `Updating user with id: ${id} and data: ${objectFormatter(
        req.body
      )}`
    })
    findedUser.set({ ...req.body })
    await findedUser.save()

    logger.http({ prefix, message: `user updated successfully` })
    logger.http({ prefix, message: 'Request finished...' })

    res.json(findedUser)
  } catch (err) {
    logger.error({ prefix, message: err.message })
    return res.json({ errors: 'Something went wrong' })
  }
}

const deleteUser = async (req, res) => {
  const prefix = 'deleteUser'

  try {
    logger.http({ prefix, message: 'Request incoming...' })
    logger.http({ prefix, message: `deleting user with id: ${req.params.id}` })

    await User.findByIdAndDelete(req.params.id)

    logger.http({ prefix, message: 'user deleted successfully' })
    logger.http({ prefix, message: 'Request finished...' })

    res.json({ message: 'User deleted successfully' })
  } catch (err) {
    logger.error({ prefix, message: err.message })
    return res.json({ errors: 'Something went wrong' })
  }
}

const signinUser = async (req, res) => {
  const prefix = 'signinUser'

  try {
    logger.http({ prefix, message: 'Request incoming...' })

    const { email, password } = req.body
    const existingUser = await User.findOne({ email })

    if (!existingUser) {
      logger.error({ prefix, message: 'Invalid credentials' })
      return res.status(400).send({ errors: 'Invalid credentials' })
    }

    const passwordMatch = await Password.compare(
      existingUser.password,
      password
    )

    if (!passwordMatch) {
      logger.error({ prefix, message: 'Invalid credentials' })
      return res.status(400).send({ errors: 'Invalid credentials' })
    }
    const token = createToken(
      existingUser.id,
      existingUser.email,
      existingUser.role
    )
    if (!token) {
      logger.error({ prefix, message: 'Token not created' })
      return res.status(400).send({ errors: 'Token not created' })
    }

    res.status(201).send({ token })
  } catch (err) {
    logger.error({ prefix, message: err.message })
    return res.json({ errors: 'Something went wrong' })
  }
}

export { getUser, getAllUsers, createUser, updateUser, deleteUser, signinUser }
