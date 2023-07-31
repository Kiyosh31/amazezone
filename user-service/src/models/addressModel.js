import mongoose, { Types } from 'mongoose'

const AddressSchema = mongoose.Schema({
  userId: {
    type: Types.ObjectId
  },
  name: {
    type: String,
    required: true,
    minLength: 5
  },
  address: {
    type: String,
    required: true,
    minLength: 5
  },
  postalCode: {
    type: Number,
    required: true,
    minLength: 5
  },
  phone: {
    type: String,
    required: true,
    minLength: 5
  }
})

const Address = mongoose.model('Address', AddressSchema)
export default Address
