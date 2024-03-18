import mongoose from 'mongoose'

const Key = mongoose.model(
  'Key',
  new mongoose.Schema(
    {
      resetPasswordToken: String,
      refreshToken: String,
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    },
    {
      timestamps: true
    }
  )
)

export default Key
