import { Request, Response, NextFunction } from 'express'

import bcryptjs from 'bcryptjs'
import * as jwt from 'jsonwebtoken'
import { validationResult } from 'express-validator'

import db from '~/models'

class AuthController {
  public static async signup(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      const err: any = new Error('Validation failed!')
      err.statusCode = 422
      err.data = errors.array()
      return next(err)
    }

    const { email, username, password } = req.body as unknown as { email: string; username: string; password: string }

    try {
      const user = await db.User.findOne({ email })
      if (user) {
        const err: any = new Error('User already exists!')
        err.statusCode = 409
        throw err
      }

      const hashedPassword = await bcryptjs.hash(password, 12)
      const newUser = await db.User.create({ email, username, password: hashedPassword })
      await db.Key.create({ userId: newUser._id, refreshToken: '' })

      return res.status(201).json({ message: 'User created!', userId: newUser._id })
    } catch (err: any) {
      if (!err.statusCode) {
        err.statusCode = 500
      }
      return next(err)
    }
  }
  public static async signin(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      const err: any = new Error('Validation failed!')
      err.statusCode = 422
      err.data = errors.array()
      return next(err)
    }

    const { email, password } = req.body as unknown as { email: string; password: string }

    try {
      const user = await db.User.findOne({ email })
      if (!user) {
        const err: any = new Error('User not found!')
        err.statusCode = 404
        throw err
      }

      const isEqual = await bcryptjs.compare(password, user.password as string)
      if (!isEqual) {
        const err: any = new Error('Wrong password!')
        err.statusCode = 401
        throw err
      }

      const accessToken = createAccessToken({ _id: user._id, email: user.email, role: user.role })
      const refreshToken = createRefreshToken({ _id: user._id, email: user.email, role: user.role })

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        path: '/api/v1/auth/refresh_token',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      })

      const key = await db.Key.findOne({ userId: user._id })
      if (key) {
        key.refreshToken = refreshToken
        await key.save()
      } else {
        await db.Key.create({ userId: user._id, refreshToken })
      }

      return res.status(200).json({ accessToken, refreshToken, userId: user._id })
    } catch (err: any) {
      if (!err.statusCode) {
        err.statusCode = 500
      }
      return next(err)
    }
  }
  public static async signout(req: Request, res: Response, next: NextFunction) {
    try {
      res.clearCookie('refreshToken', { path: '/api/v1/auth/refresh_token' })
      await db.Key.deleteOne({ refreshToken: req.cookies.refreshToken })
      return res.status(200).json({
        success: true,
        message: 'Logout success!'
      })
    } catch (err: any) {
      if (!err.statusCode) {
        err.statusCode = 500
      }
      next(err)
    }
  }
  public static async generateAccessToken(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies.refreshToken
      const key = await db.Key.findOne({ refreshToken })
      if (!refreshToken || !key) {
        const err: any = new Error('You are not logged in!')
        err.statusCode = 400
        throw err
      }

      jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string, async (error: any, result: any) => {
        if (error) {
          const err: any = new Error('Please Login or Register')
          err.statusCode = 400
          throw err
        }

        const user = await db.User.findOne({ _id: result._id })
        if (!user) {
          return res.status(400).json({ success: false, message: 'This user is not exist!' })
        }

        const accessToken = createAccessToken({ _id: result._id, role: result.role, email: result.email })
        return res.status(200).json({
          success: true,
          message: 'Generate new access token success!',
          data: {
            token: accessToken
          }
        })
      })
    } catch (err: any) {
      if (!err.statusCode) {
        err.statusCode = 500
      }
      next(err)
    }
  }
}

const createAccessToken = (payload: jwt.JwtPayload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET as string, { expiresIn: '1h' })
}

const createRefreshToken = (payload: jwt.JwtPayload) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET as string, { expiresIn: '7d' })
}

export default AuthController
