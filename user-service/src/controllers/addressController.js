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
    const address = await findDefaultAddress(id)
    if (address.length === 0) {
      logger.error({ prefix, message: 'Address not found' })
      return res.status(400).json({ errors: 'Address not found' })
    }

    logger.info({
      prefix,
      message: `Address found: ${objectFormatter(address)}`
    })
    logger.info({ prefix, message: 'Request finished...' })

    res.json(address)
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

    const existingAddress = await findAddressById(id)
    if (!existingAddress) {
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
    if (isAddressMine(authorization, existingAddress)) {
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

    existingAddress.set({ ...req.body })
    await existingAddress.save()

    logger.http({ prefix, message: `address updated successfully` })
    logger.http({ prefix, message: 'Request finished...' })

    res.json(existingAddress)
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

    const existingAddress = await findAddressById(id)
    if (!existingAddress) {
      logger.error({ prefix, message: 'Address not found' })
      return res.status(400).json({ errors: 'Address not found' })
    }

    // check if the address belongs to te user
    if (isAddressMine(authorization, existingAddress)) {
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
