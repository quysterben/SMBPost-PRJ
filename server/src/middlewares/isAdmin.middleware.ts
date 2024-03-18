import { Response, NextFunction } from 'express'

const isAdmin = (req: any, res: Response, next: NextFunction) => {
  if (req.user.role !== 'admin') {
    const err: any = new Error('You are not authorized to access this resource')
    err.statusCode = 403
    return next(err)
  }
  return next()
}

export default isAdmin
