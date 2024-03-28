import { Request, Response, NextFunction } from 'express'

import db from '~/models'

const defaultPassword = '12345678'

class UserController {
  public static async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await db.User.find({ role: ['shippingCenter', 'admin', 'storehouse'] }, '-password')
      return res.status(200).json({ message: 'Users fetched!', users })
    } catch (err: any) {
      if (!err.statusCode) {
        err.statusCode = 500
      }
      return next(err)
    }
  }
  public static async getUserById(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id
    try {
      const user = await db.User.findById(id, '-password')
      if (!user) {
        const err: any = new Error('User not found!')
        err.statusCode = 404
        throw err
      }
      return res.status(200).json({ message: 'User fetched!', user })
    } catch (err: any) {
      if (!err.statusCode) {
        err.statusCode = 500
      }
      return next(err)
    }
  }
  public static async createNewUser(req: Request, res: Response, next: NextFunction) {
    const { email, username, role, phonenumber, address } = req.body as unknown as {
      email: string
      username: string
      role: string
      phonenumber: string
      address: string
    }

    try {
      const user = await db.User.findOne({ email })
      if (user) {
        const err: any = new Error('User already exists!')
        err.statusCode = 409
        throw err
      }

      const checkUser = await db.User.findOne({ phonenumber })
      if (checkUser) {
        const err: any = new Error('Phone number already exists!')
        err.statusCode = 409
        throw err
      }

      const newUser = await db.User.create({
        email,
        username,
        password: defaultPassword,
        role,
        phonenumber,
        address,
        isActive: false
      })
      return res.status(201).json({ message: 'User created!', userId: newUser._id })
    } catch (err: any) {
      if (!err.statusCode) {
        err.statusCode = 500
      }
      return next(err)
    }
  }
}

export default UserController
