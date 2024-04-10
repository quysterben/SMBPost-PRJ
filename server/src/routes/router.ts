import express, { Express } from 'express'

import AuthRouter from './auth.routes'
import UserRouter from './user.routes'
import ImageRouter from './image.routes'

const serverRoute: Express = express()

serverRoute.use('/auth', AuthRouter)
serverRoute.use('/user', UserRouter)
serverRoute.use('/image', ImageRouter)

export default serverRoute
