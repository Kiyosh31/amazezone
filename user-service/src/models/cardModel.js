import mongoose, { Types } from 'mongoose'

const CardSchema = new mongoose.Schema({
  userId: {
    type: Types.ObjectId
  },
  name: {
    type: String,
    required: true,
    minLength: 5
  },
  number: {
    type: Number,
    required: true,
    minLength: 5
  },
  secretCode: {
    type: String,
    required: true,
    minLength: 3
  },
  expiration: {
    type: String,
    required: true,
    minLength: 5
  },
  type: {
    type: String,
    required: true,
    minLength: 4
  },
  default: {
    type: Boolean,
    required: true
  }
})

const Card = mongoose.model('Card', CardSchema)
export default Card
