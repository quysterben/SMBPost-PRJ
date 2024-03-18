import { Request, Response, NextFunction } from 'express'

import db from '~/models'

class UserController {
  public static async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await db.User.find({})
      return res.status(200).json({ message: 'Users fetched!', users })
    } catch (err: any) {
      if (!err.statusCode) {
        err.statusCode = 500
      }
      return next(err)
    }
  }
}

export default UserController
