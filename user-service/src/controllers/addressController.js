import Address from '../models/addressModel.js'
import User from '../models/userModel.js'
import { logger, objectFormatter } from '../utils/logger.js'
import { isTokenValid } from '../utils/token.js'

const getAddress = (address) => Address.findOne({ address: address })

const getUser = (id) => User.findOne({ _id: id })

const isAddressMine = (authorization, existingAddress) => {
  const token = isTokenValid(authorization)
  return existingAddress.userId === token.data.id
}

const createAddress = async (req, res) => {
  const prefix = 'createAddress'

  try {
    logger.http({ prefix, message: 'Request incoming...' })

    const { address, userId } = req.body

    logger.http({
      prefix,
      message: `Searching for existing address: ${address}`
    })
    const existingAddress = await getAddress(address)
    if (existingAddress) {
      logger.error({ prefix, message: 'Address already exists' })
      return res.status(400).json({ errors: 'Address already exists' })
    }

    logger.http({
      prefix,
      message: `Searching for existing user with id: ${userId}`
    })
    const existingUser = await getUser(userId)
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

const updateAddress = async (req, res) => {
  const prefix = 'updateAddress'

  try {
    const { id } = req.params
    const { userId } = req.body

    logger.http({ prefix, message: 'Request incoming...' })
    logger.http({
      prefix,
      message: `Searching address with id: ${id}`
    })

    const existingAddress = await Address.findOne({ _id: id })
    if (!existingAddress) {
      logger.error({ prefix, message: 'Address not found' })
      return res.status(400).json({ errors: 'Address not found' })
    }

    logger.http({
      prefix,
      message: `Searching user with id: ${userId}`
    })
    const existingUser = await getUser(userId)
    if (!existingUser) {
      logger.error({ prefix, message: 'User to attach address not found' })
      return res
        .status(400)
        .json({ errors: 'User to attach address not found' })
    }

    // check if the address belongs to te user
    if (isAddressMine(req.headers.authorization, existingAddress)) {
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
    const { id } = req.params

    logger.http({ prefix, message: 'Request incoming...' })
    logger.http({
      prefix,
      message: `Searching address with id: ${id}`
    })

    const existingAddress = await Address.findOne({ _id: id })
    if (!existingAddress) {
      logger.error({ prefix, message: 'Address not found' })
      return res.status(400).json({ errors: 'Address not found' })
    }

    // check if the address belongs to te user
    if (isAddressMine(req.headers.authorization, existingAddress)) {
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

    await Address.findByIdAndDelete(id)

    logger.http({ prefix, message: `Address deleted successfully` })
    logger.http({ prefix, message: 'Request finished...' })

    res.json({ message: 'Address deleted successfully' })
  } catch (err) {
    logger.error({ prefix, message: err.message })
    return res.json({ errors: 'Something went wrong' })
  }
}

export { createAddress, updateAddress, deleteAddress }
