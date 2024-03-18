import { Router } from 'express'
import passport from 'passport'

import UserController from '~/controllers/user.controller'
import isAdmin from '~/middlewares/isAdmin.middleware'

const UserRouter = Router()

UserRouter.get('/', passport.authenticate('jwt', { session: false }), isAdmin, UserController.getAllUsers)

export default UserRouter
