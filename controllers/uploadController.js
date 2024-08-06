const sharp = require('sharp')
const path = require('path')
const fs = require('fs')
const User = require('../models/user')



const uploadAvatar = async (req, res) => {
    const avatarPath = path.join(__dirname, '../uploads', req.file.filename)
  
    await sharp(avatarPath)
      .resize(200, 200)
      .toFile(`${avatarPath}-thumbnail${path.extname(req.file.filename)}`)
  
    const avatarThumbnailPath = `uploads/${req.file.filename}-thumbnail${path.extname(req.file.filename)}`
  
    const userId = res.locals.user.id
    
    await User.findByIdAndUpdate(userId, { avatar: avatarThumbnailPath })
  
    res.send('圖片上傳成功並保存路徑到資料庫')
  }

  module.exports = {
    uploadAvatar,
}