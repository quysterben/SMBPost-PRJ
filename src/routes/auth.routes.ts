import { Router } from 'express'

import AuthController from '~/controllers/auth.controller'
import signinValidation from '~/validations/Auth/signinValidation'
import signupValidation from '~/validations/Auth/signupValidation'

const AuthRouter = Router()

AuthRouter.post('/signin', signinValidation, AuthController.signin)
AuthRouter.post('/signup', signupValidation, AuthController.signup)
AuthRouter.post('/signout', AuthController.signout)

AuthRouter.post('/refresh_token', AuthController.generateAccessToken)

export default AuthRouter
