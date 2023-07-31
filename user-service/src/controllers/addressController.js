import Address from '../models/addressModel.js'
import { logger, objectFormatter } from '../utils/logger.js'
import { RESPONSE_TYPES } from '../utils/responseTypes.js'
import { isTokenValid } from '../utils/token.js'

const isAddressMine = (authorization, existingAddress) => {
  const token = isTokenValid(authorization)
  return existingAddress.userId === token.data.id
}

const createAddress = async (req, res) => {
  const prefix = 'createAddress'

  try {
    logger.http({ prefix, message: RESPONSE_TYPES.REQUEST_INCOMING })

    const { address } = req.body

    const existingAddress = await Address.findOne({ address: address })
    if (existingAddress) {
      logger.error({ prefix, message: RESPONSE_TYPES.EXISTING_ADDRESS })
      return res.status(400).json({ errors: RESPONSE_TYPES.EXISTING_ADDRESS })
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
    logger.http({ prefix, message: RESPONSE_TYPES.REQUEST_FINISHED })

    res.json(newAddress)
  } catch (err) {
    logger.error({ prefix, message: err.message })
  }
}

const updateAddress = async (req, res) => {
  const prefix = 'updateAddress'

  try {
    const { id } = req.body

    logger.http({ prefix, message: RESPONSE_TYPES.REQUEST_INCOMING })
    logger.http({
      prefix,
      message: `Searching address with id: ${id}`
    })

    const existingAddress = await Address.findOne({ _id: id })
    if (!existingAddress) {
      logger.error({ prefix, message: RESPONSE_TYPES.ADDRESS_NOT_FOUND })
      return res.status(400).json({ errors: RESPONSE_TYPES.ADDRESS_NOT_FOUND })
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
    logger.http({ prefix, message: RESPONSE_TYPES.REQUEST_FINISHED })

    res.json(existingAddress)
  } catch (err) {
    logger.error({ prefix, message: err.message })
  }
}

const deleteAddress = async (req, res) => {
  const prefix = 'deleteAddress'

  try {
    const { id } = req.body

    logger.http({ prefix, message: RESPONSE_TYPES.REQUEST_INCOMING })
    logger.http({
      prefix,
      message: `Searching address with id: ${id}`
    })

    const existingAddress = await Address.findOne({ _id: id })
    if (!existingAddress) {
      logger.error({ prefix, message: RESPONSE_TYPES.ADDRESS_NOT_FOUND })
      return res.status(400).json({ errors: RESPONSE_TYPES.ADDRESS_NOT_FOUND })
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
    logger.http({ prefix, message: RESPONSE_TYPES.REQUEST_FINISHED })

    res.json({ message: 'Address deleted successfully' })
  } catch (err) {
    logger.error({ prefix, message: err.message })
  }
}

export { createAddress, updateAddress, deleteAddress }
