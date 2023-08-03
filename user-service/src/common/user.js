import User from '../models/userModel.js'
import { isTokenValid } from '../utils/token.js'

const findUserByEmail = (email) => User.findOne({ email })
const findUserById = (id) => User.findOne({ _id: id })
const findAllUsers = () => User.find({})
const deleteSingleUser = (id) => User.findByIdAndDelete(id)

const isUserMine = (auth, user) => {
  const token = isTokenValid(auth)
  const userId = user._id.toString() || user.id
  return userId === token.data.id
}

export {
  findUserByEmail,
  findUserById,
  findAllUsers,
  deleteSingleUser,
  isUserMine
}
