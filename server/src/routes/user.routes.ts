import { Router } from 'express'
import passport from 'passport'

import UserController from '~/controllers/user.controller'
import isAdmin from '~/middlewares/isAdmin.middleware'

const UserRouter = Router()

UserRouter.get('/', passport.authenticate('jwt', { session: false }), UserController.getAllUsers)
UserRouter.get('/get-user/:id', passport.authenticate('jwt', { session: false }), isAdmin, UserController.getUserById)
UserRouter.post('/create-user', passport.authenticate('jwt', { session: false }), isAdmin, UserController.createNewUser)
UserRouter.put('/active/:id', passport.authenticate('jwt', { session: false }), isAdmin, UserController.activeUser)
UserRouter.get('/customers', UserController.getCustomers)
UserRouter.get('/staffs', passport.authenticate('jwt', { session: false }), UserController.getStaffs)

export default UserRouter
