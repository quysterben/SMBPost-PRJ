import express, { Express } from 'express'

import AuthRouter from './auth.routes'
import UserRouter from './user.routes'

const serverRoute: Express = express()

serverRoute.use('/auth', AuthRouter)
serverRoute.use('/user', UserRouter)

export default serverRoute
