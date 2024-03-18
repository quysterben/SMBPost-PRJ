import mongoose from 'mongoose'

const User = mongoose.model(
  'User',
  new mongoose.Schema(
    {
      username: String,
      email: String,
      password: String,
      role: {
        type: String,
        enum: ['shippingCenter', 'admin', 'storehouse', 'customer'],
        default: 'customer'
      }
    },
    {
      timestamps: true
    }
  )
)

export default User
