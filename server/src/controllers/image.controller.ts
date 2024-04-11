import fs from 'fs'
import path from 'path'
import { v2 as cloudinary } from 'cloudinary'
import { extractPublicId } from 'cloudinary-build-url'
import 'dotenv/config'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

class ImageController {
  public static async uploadImage(req: any, res: any, next: any) {
    try {
      const file = req.file
      if (!file) {
        const error: any = new Error('No image provided')
        error.statusCode = 400
        throw error
      }

      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'res/images'
      })
      await clearImage(file.path)

      res.status(201).json({
        success: true,
        message: 'Images uploaded successfully',
        imageURL: result.url
      })
    } catch (error) {
      next(error)
    }
  }
  public static async deleteImage(req: any, res: any, next: any) {
    try {
      const { imageURL } = req.body
      if (!imageURL) {
        const error: any = new Error('No image provided')
        error.statusCode = 400
        throw error
      }

      await cloudinary.uploader.destroy(extractPublicId(imageURL))

      res.status(200).json({
        success: true,
        message: 'Image deleted successfully'
      })
    } catch (error) {
      next(error)
    }
  }
}

const clearImage = async (filePath: string) => {
  filePath = path.join('..', '..', filePath)
  fs.unlink(filePath, (err) => console.log(err))
}

export default ImageController
