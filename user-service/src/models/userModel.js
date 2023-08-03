import mongoose from 'mongoose'
import Password from '../utils/password.js'

const userType = ['user', 'seller']

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlegnth: 5
    },
    lastName: {
      type: String,
      required: true,
      minlegnth: 5
    },
    birth: {
      type: String,
      required: true,
      minlegnth: 5
    },
    email: {
      type: String,
      required: true,
      minlegnth: 5
    },
    password: {
      type: String,
      required: true,
      minlegnth: 5
    },
    role: {
      type: String,
      Enumerator: userType,
      required: true
    }
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.password
        delete ret.__v
      }
    }
  }
)

UserSchema.pre('save', async function (done) {
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'))
    this.set('password', hashed)
  }

  done()
})

const User = mongoose.model('User', UserSchema)
export default User
