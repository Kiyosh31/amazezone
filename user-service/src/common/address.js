import Address from '../models/addressModel.js'
import { isTokenValid } from '../utils/token.js'

const findAddressByAddress = (address) => Address.findOne({ address })
const findAddressById = (id) => Address.findOne({ _id: id })
const deleteAddressById = (id) => Address.findByIdAndDelete(id)
const findDefaultAddress = (id) => Address.find({ userId: id, default: true })
const findAllAddress = (id) => Address.find({ userId: id })

const isAddressMine = (authorization, existingAddress) => {
  const token = isTokenValid(authorization)
  return existingAddress.userId === token.data.id
}

export {
  findAddressByAddress,
  findAddressById,
  deleteAddressById,
  findDefaultAddress,
  findAllAddress,
  isAddressMine
}
