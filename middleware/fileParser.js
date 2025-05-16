import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import multer from 'multer'

// Cloudinary config (sets up the account to make the calls to)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

// Configure cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'itinero_uploads',
    format: 'png',
    public_id: (req, file) => {
      return Date.now() + '-' + file.originalname.split('.')[0]
    }
  }
})
const parser = multer({ storage })

export default parser