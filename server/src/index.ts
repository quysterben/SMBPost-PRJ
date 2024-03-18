import path from 'path'

import express, { Express, Request, Response } from 'express'
import cors from 'cors'
import multer from 'multer'

import dotenv from 'dotenv'
import helmet from 'helmet'

import cookieParser from 'cookie-parser'

import passport from 'passport'
import { applyPassportStrategy } from './store/passport'

import serverRoute from './routes/router'

import db from './models'

dotenv.config()

const app: Express = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(helmet())
app.use(cors())

// Passport
applyPassportStrategy(passport)

app.use(express.static('public'))
app.use(cookieParser())

// Multer
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images')
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`)
  }
})
const fileFilter = (req: Request, file: any, cb: any) => {
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
    cb(null, true)
  } else {
    cb(null, false)
  }
}
app.use(multer({ storage: fileStorage, fileFilter }).array('image', 10))
app.use('/res/images', express.static(path.join(__dirname, 'res', 'images')))

// Routes
app.get('/', (req: Request, res: Response) => {
  res.json({ messenge: 'Hello xin chao' })
})
app.use('/api/v1', serverRoute)
app.use((err: any, req: Request, res: Response, next: any) => {
  const status = err.statusCode || 500
  const message = err.message
  const data = err.data
  res.status(status).json({
    message: message,
    success: false,
    data: data
  })
})

// Connect Database
db.mongoose
  .connect(
    `mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@ecomshopcluster.evimone.mongodb.net/${process.env.DATABASE_NAME}`
  )
  .then(() => {
    console.log('Connect Database Success')
  })
  .catch((err) => {
    console.error('connection error', err)
    process.exit
  })

const port = process.env.PORT || 9900
app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
