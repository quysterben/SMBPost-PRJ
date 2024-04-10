import { Router } from 'express'
import passport from 'passport'

import ImageController from '~/controllers/image.controller'

const ImageRouter = Router()

ImageRouter.post('/upload', passport.authenticate('jwt', { session: false }), ImageController.uploadImage)
ImageRouter.delete('/delete', passport.authenticate('jwt', { session: false }), ImageController.deleteImage)

export default ImageRouter
