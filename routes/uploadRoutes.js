const express = require('express')
const router = express.Router()
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { checkUser } = require('../middleware/authMiddleware')
const { uploadAvatar } = require('../controllers/uploadController')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = './uploads'
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir)
      }
      cb(null, uploadDir)
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname)
      cb(null, `${file.fieldname}-${Date.now()}${ext}`)
    },
  })
  
  const upload = multer({ storage })

router.post('/avatar', checkUser, upload.single('avatar'), uploadAvatar)

module.exports = router