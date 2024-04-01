import { Request, Response, NextFunction } from 'express'
import bcryptjs from 'bcryptjs'

import db from '~/models'

const defaultPassword = '12345678'

class UserController {
  public static async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await db.User.find({ role: ['shippingCenter', 'storehouse', 'customer'] }, '-password')
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

      const hashedPassword = await bcryptjs.hash(defaultPassword, 12)

      const newUser = await db.User.create({
        email,
        username,
        password: hashedPassword,
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
  public static async activeUser(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id
    try {
      const user = await db.User.findById(id)
      if (!user) {
        const err: any = new Error('User not found!')
        err.statusCode = 404
        throw err
      }
      user.isActive = !user.isActive
      await user.save()
      return res.status(200).json({ message: 'User updated!', user })
    } catch (err: any) {
      if (!err.statusCode) {
        err.statusCode = 500
      }
      return next(err)
    }
  }
  public static async getCustomers(req: Request, res: Response, next: NextFunction) {
    try {
      const customers = await db.User.find({ role: 'customer', isActive: true }, '-password')
      return res.status(200).json({ message: 'Customers fetched!', customers })
    } catch (err: any) {
      if (!err.statusCode) {
        err.statusCode = 500
      }
      return next(err)
    }
  }
  public static async getStaffs(req: Request, res: Response, next: NextFunction) {
    try {
      const staffs = await db.User.find({ role: ['shippingCenter', 'storehouse'], isActive: true }, '-password')
      return res.status(200).json({ message: 'Staffs fetched!', staffs })
    } catch (err: any) {
      if (!err.statusCode) {
        err.statusCode = 500
      }
      return next(err)
    }
  }
}

export default UserController
