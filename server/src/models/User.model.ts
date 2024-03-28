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
      },
      isActive: {
        type: Boolean,
        default: true
      },
      phonenumber: String,
      address: String
    },
    {
      timestamps: true
    }
  )
)

export default User
