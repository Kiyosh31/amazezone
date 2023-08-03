import Address from '../models/addressModel.js'
import { logger, objectFormatter } from '../utils/logger.js'
import {
  deleteAddressById,
  findAddressByAddress,
  findAddressById,
  findAllAddress,
  findDefaultAddress,
  isAddressMine
} from '../common/address.js'
import { findUserById } from '../common/user.js'
import { redisClient } from '../index.js'
import { transformRedisToJSON, transformJSONToRedis } from '../utils/redis.js'

const createAddress = async (req, res) => {
  const prefix = 'createAddress'

  try {
    logger.http({ prefix, message: 'Request incoming...' })

    const { address, userId } = req.body

    logger.http({
      prefix,
      message: `Searching for existing address: ${address}`
    })
    const existingAddress = await findAddressByAddress(address)
    if (existingAddress) {
      logger.error({ prefix, message: 'Address already exists' })
      return res.status(400).json({ errors: 'Address already exists' })
    }

    logger.http({
      prefix,
      message: `Searching for existing user with id: ${userId}`
    })
    const existingUser = await findUserById(userId)
    if (!existingUser) {
      logger.error({ prefix, message: 'User to attach address not found' })
      return res
        .status(400)
        .json({ errors: 'User to attach address not found' })
    }

    const newAddress = new Address({ ...req.body })
    logger.http({
      prefix,
      message: `Creating address with data: ${newAddress}`
    })
    await newAddress.save()

    logger.http({
      prefix,
      message: `Address created successfully: ${newAddress}`
    })
    logger.http({ prefix, message: 'Request finished...' })

    res.json(newAddress)
  } catch (err) {
    logger.error({ prefix, message: err.message })
    return res.json({ errors: 'Something went wrong' })
  }
}

const getAddress = async (req, res) => {
  const prefix = 'getAddress'
  try {
    logger.info({ prefix, message: 'Request incoming...' })

    const { id } = req.params

    logger.info({ prefix, message: `Searching for addres with userId: ${id}` })

    // REDIS CHECK
    const redisFindedAddress = await redisClient.get(`address?id=${id}`)
    if (redisFindedAddress) {
      logger.http({
        prefix,
        message: `Address found in redis: ${redisFindedAddress}`
      })
      const address = transformRedisToJSON(redisFindedAddress)

      logger.http({ prefix, message: 'Request finished...' })

      res.json(address)
    } else {
      // DATABASE CHECK
      const mongoFindedAddress = await findDefaultAddress(id)
      if (mongoFindedAddress.length === 0) {
        logger.error({ prefix, message: 'Address not found' })
        return res.status(400).json({ errors: 'Address not found' })
      }

      logger.info({
        prefix,
        message: `Address found in database: ${objectFormatter(
          mongoFindedAddress
        )}`
      })

      logger.info({
        prefix,
        message: 'Adding address to redis'
      })
      await redisClient.set(
        `address?id=${id}`,
        transformJSONToRedis(mongoFindedAddress)
      )
      logger.info({
        prefix,
        message: 'Address added redis'
      })

      logger.info({ prefix, message: 'Request finished...' })

      res.json(mongoFindedAddress)
    }
  } catch (err) {
    logger.error({ prefix, message: err.message })
    return res.json({ errors: 'Something went wrong' })
  }
}

const getAllAddress = async (req, res) => {
  const prefix = 'getAllAddress'
  try {
    logger.info({ prefix, message: 'Request incoming...' })

    const { id } = req.params

    const allAddress = await findAllAddress(id)
    if (allAddress.length === 0) {
      logger.error({ prefix, message: 'Address not found' })
      return res.status(400).json({ errors: 'Address not found' })
    }

    logger.info({ prefix, message: 'Request finished...' })
    res.json(allAddress)
  } catch (err) {
    logger.error({ prefix, message: err.message })
    return res.json({ errors: 'Something went wrong' })
  }
}

const updateAddress = async (req, res) => {
  const prefix = 'updateAddress'

  try {
    const { authorization } = req.headers
    const { id } = req.params
    const { userId } = req.body

    logger.http({ prefix, message: 'Request incoming...' })

    logger.http({
      prefix,
      message: `Searching address with id: ${id}`
    })

    const mongoFindedAddress = await findAddressById(id)
    if (!mongoFindedAddress) {
      logger.error({ prefix, message: 'Address not found' })
      return res.status(400).json({ errors: 'Address not found' })
    }

    logger.http({
      prefix,
      message: `Searching user with id: ${userId}`
    })
    const existingUser = await findUserById(userId)
    if (!existingUser) {
      logger.error({ prefix, message: 'User to attach address not found' })
      return res
        .status(400)
        .json({ errors: 'User to attach address not found' })
    }

    // check if the address belongs to te user
    if (isAddressMine(authorization, mongoFindedAddress)) {
      logger.error({
        prefix,
        message: "You don't have permission to update this address"
      })
      return res
        .status(401)
        .json({ errors: "You don't have permission to update this address" })
    }

    logger.http({
      prefix,
      message: `Updating address with data: ${objectFormatter(req.body)}`
    })

    mongoFindedAddress.set({ ...req.body })
    await mongoFindedAddress.save()

    logger.http({ prefix, message: 'Address updated successfully in database' })

    // REDIS UPDATE
    const redisAddress = await redisClient.get(`address?id=${id}`)
    logger.http({
      prefix,
      message: `Updating address in redis: ${redisAddress}`
    })

    await redisClient.del(`address?id=${mongoFindedAddress.userId}`)
    await redisClient.set(
      `address?id=${mongoFindedAddress.userId}`,
      transformJSONToRedis(mongoFindedAddress)
    )

    logger.http({ prefix, message: 'Address updated successfully in redis' })
    logger.http({ prefix, message: 'Request finished...' })

    res.json(mongoFindedAddress)
  } catch (err) {
    logger.error({ prefix, message: err.message })
    return res.json({ errors: 'Something went wrong' })
  }
}

const deleteAddress = async (req, res) => {
  const prefix = 'deleteAddress'

  try {
    const { authorization } = req.headers
    const { id } = req.params

    logger.http({ prefix, message: 'Request incoming...' })

    logger.http({
      prefix,
      message: `Searching address with id: ${id}`
    })

    const mongoFindedAddress = await findAddressById(id)
    if (!mongoFindedAddress) {
      logger.error({ prefix, message: 'Address not found' })
      return res.status(400).json({ errors: 'Address not found' })
    }

    // check if the address belongs to te user
    if (isAddressMine(authorization, mongoFindedAddress)) {
      logger.error({
        prefix,
        message: "You don't have permission to delete this address"
      })
      return res
        .status(401)
        .json({ errors: "You don't have permission to delete this address" })
    }

    logger.http({
      prefix,
      message: `Deleting address`
    })

    await deleteAddressById(id)

    // REDIS DELETION
    const redisAddress = await redisClient.get(
      `address?id=${mongoFindedAddress.userId}`
    )
    if (!redisAddress) {
      logger.error({
        prefix,
        message: 'Address not found in redis'
      })
      return res.json({ message: 'Address deleted successfully' })
    }

    await redisClient.del(`address?id=${mongoFindedAddress.userId}`)

    logger.http({ prefix, message: `Address deleted successfully` })
    logger.http({ prefix, message: 'Request finished...' })

    res.json({ message: 'Address deleted successfully' })
  } catch (err) {
    logger.error({ prefix, message: err.message })
    return res.json({ errors: 'Something went wrong' })
  }
}

export {
  createAddress,
  getAddress,
  getAllAddress,
  updateAddress,
  deleteAddress
}
