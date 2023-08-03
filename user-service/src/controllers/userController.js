import User from '../models/userModel.js'
import { logger, objectFormatter } from '../utils/logger.js'
import Password from '../utils/password.js'
import { isTokenValid, createToken } from '../utils/token.js'
import { transformJSONToRedis, transformRedisToJSON } from '../utils/redis.js'
import { redisClient } from '../index.js'
import {
  findUserByEmail,
  findUserById,
  findAllUsers,
  deleteSingleUser,
  isUserMine
} from '../common/user.js'

const createUser = async (req, res) => {
  const prefix = 'createUser'

  try {
    logger.http({ prefix, message: 'Request incoming...' })

    const { email } = req.body

    const user = await findUserByEmail(email)
    if (user) {
      logger.error({ prefix, message: 'User already exists' })
      return res.status(400).send({ errors: 'User already exists' })
    }

    const newUser = new User({ ...req.body })
    logger.http({
      prefix,
      message: `Creating user with body: ${objectFormatter(req.body)}`
    })
    await newUser.save()

    logger.http({ prefix, message: `User created successfully: ${newUser}` })

    // ADDING USER TO REDIS
    logger.http({ prefix, message: 'Adding user to redis' })
    const redisUser = transformJSONToRedis(newUser)

    await redisClient.set(`user?id=${newUser._id}`, redisUser)

    logger.http({ prefix, message: 'User added successfully to redis' })
    logger.http({ prefix, message: 'Request finished...' })

    res.json(newUser)
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

    logger.http({
      prefix,
      message: `Searching user with credentials: Email: ${email} Password: ${password}`
    })

    const existingUser = await findUserByEmail(email)

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

    logger.http({ prefix, message: 'User credentials ok, creating token' })

    const token = createToken(
      existingUser.id,
      existingUser.email,
      existingUser.role
    )
    if (!token) {
      logger.error({ prefix, message: 'Token not created' })
      return res.status(400).send({ errors: 'Token not created' })
    }

    logger.http({ prefix, message: 'Request finished...' })

    res.status(201).send({ token })
  } catch (err) {
    logger.error({ prefix, message: err.message })
    return res.json({ errors: 'Something went wrong' })
  }
}

const getUser = async (req, res) => {
  const prefix = 'getUser'

  try {
    logger.http({ prefix, message: 'Request incoming...' })

    const { authorization } = req.headers
    const { id } = req.params

    logger.http({ prefix, message: `Searching user with id: ${id}` })

    // REDIS CHECK
    const redisFindedUser = await redisClient.get(`user?id=${id}`)
    if (redisFindedUser) {
      logger.http({
        prefix,
        message: `User found in redis: ${redisFindedUser}`
      })
      const user = transformRedisToJSON(redisFindedUser)

      if (!isUserMine(authorization, user)) {
        logger.error({ prefix, message: 'User not belong to this jwt' })
        return res.json({ errors: 'User not belong to this jwt' })
      }

      logger.http({ prefix, message: 'Request finished...' })

      res.json(user)
    } else {
      // DATABASE CHECK
      const mongoFindedUser = await findUserById(id)
      if (!mongoFindedUser) {
        logger.error({ prefix, message: 'User not found' })
        return res.status(400).json({ errors: 'User not found' })
      }

      logger.http({
        prefix,
        message: `User found in database: ${objectFormatter(mongoFindedUser)}`
      })

      if (!isUserMine(authorization, mongoFindedUser)) {
        logger.error({ prefix, message: 'User not belong to this jwt' })
        return res.json({ errors: 'User not belong to this jwt' })
      }

      await redisClient.set(
        `user?id=${id}`,
        transformJSONToRedis(mongoFindedUser)
      )

      logger.http({ prefix, message: 'Request finished...' })
      res.json(mongoFindedUser)
    }
  } catch (err) {
    logger.error({ prefix, message: err.message })
    return res.json({ errors: 'Something went wrong' })
  }
}

const getAllUsers = async (req, res) => {
  const prefix = 'getAllUsers'

  try {
    logger.http({ prefix, message: 'Request incoming...' })
    logger.http({ prefix, message: 'Searching for all users' })

    const usersInMongo = await findAllUsers()

    if (!usersInMongo || usersInMongo.length === 0) {
      logger.error({ prefix, message: 'No users found' })
      return res.status(400).send({ errors: 'No users found' })
    }

    logger.http({
      prefix,
      message: `User found in database: ${usersInMongo}`
    })
    logger.http({ prefix, message: 'Request finished...' })

    res.json(usersInMongo)
  } catch (err) {
    logger.error({ prefix, message: err.message })
    return res.json({ errors: 'Something went wrong' })
  }
}

const updateUser = async (req, res) => {
  const prefix = 'updateUser'
  try {
    logger.http({ prefix, message: 'Request incoming...' })

    const { authorization } = req.headers
    const { id } = req.params

    logger.http({ prefix, message: `Searching for user with id: ${id}` })

    const mongoFindedUser = await findUserById(id)
    if (!mongoFindedUser) {
      logger.error({ prefix, message: 'User not found' })
      return res.status(400).json({ errors: 'User not found' })
    }

    if (!isUserMine(authorization, mongoFindedUser)) {
      logger.error({ prefix, message: 'User not belong to this jwt' })
      return res.json({ errors: 'User not belong to this jwt' })
    }

    logger.http({
      prefix,
      message: `Updating user with id: ${id} and data: ${objectFormatter(
        req.body
      )}`
    })
    mongoFindedUser.set({ ...req.body })
    await mongoFindedUser.save()

    logger.http({ prefix, message: 'User updated successfully in database' })
    logger.http({ prefix, message: 'Searching user in redis' })

    // REDIS UPDATE
    const redisUser = await redisClient.get(`user?id=${id}`)
    logger.http({
      prefix,
      message: `Updating user in redis: ${redisUser}`
    })

    await redisClient.del(`user?id=${id}`)
    await redisClient.set(
      `user?id=${id}`,
      transformJSONToRedis(mongoFindedUser)
    )

    logger.http({ prefix, message: 'User updated successfully in redis' })
    logger.http({ prefix, message: 'Request finished...' })

    res.json(mongoFindedUser)
  } catch (err) {
    logger.error({ prefix, message: err.message })
    return res.json({ errors: 'Something went wrong' })
  }
}

const deleteUser = async (req, res) => {
  const prefix = 'deleteUser'

  try {
    const { authorization } = req.headers
    const { id } = req.params

    logger.http({ prefix, message: 'Request incoming...' })

    const mongoFindedUser = await findUserById(id)
    if (!mongoFindedUser) {
      logger.error({ prefix, message: 'User not found' })
      return res.json({ errors: 'User not found' })
    }

    if (!isUserMine(authorization, mongoFindedUser)) {
      logger.error({ prefix, message: 'User not belong to this jwt' })
      return res.json({ errors: 'User not belong to this jwt' })
    }

    logger.http({ prefix, message: `Deleting user with id: ${id}` })

    await deleteSingleUser(id)

    logger.http({ prefix, message: 'User deleted successfully from database' })
    logger.http({ prefix, message: 'Searching user in redis' })

    // REDIS DELETION
    const redisUser = await redisClient.get(`user?id=${id}`)
    if (!redisUser) {
      logger.error({
        prefix,
        message: 'User not found in redis'
      })

      return res.json({ message: 'User deleted successfully' })
    }

    logger.http({
      prefix,
      message: 'User found in redis, deleting it'
    })
    await redisClient.del(`user?id=${id}`)

    logger.http({
      prefix,
      message: 'User deleted successfully from redis'
    })
    logger.http({ prefix, message: 'Request finished...' })

    res.json({ message: 'User deleted successfully' })
  } catch (err) {
    logger.error({ prefix, message: err.message })
    return res.json({ errors: 'Something went wrong' })
  }
}

export { getUser, getAllUsers, createUser, updateUser, deleteUser, signinUser }
