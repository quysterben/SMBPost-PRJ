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
        enum: ['user', 'admin'],
        default: 'user'
      }
    },
    {
      timestamps: true
    }
  )
)

export default User
