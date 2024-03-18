import User from './User.model'
import Key from './Key.model'

import mongoose from 'mongoose'
mongoose.Promise = global.Promise

interface Database {
  mongoose: typeof mongoose
  User: typeof User
  Key: typeof Key
}

const db: Database = {
  mongoose: mongoose,
  User: User,
  Key: Key
}

export default db
