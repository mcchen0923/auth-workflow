const nodeMediaServer = require('node-media-server')
const config = require('../config/nodeMediaServerConfig')
const redisService = require('./redisService')
const User = require('../models/user')

const nms = new nodeMediaServer(config)

const startNMS = () => {
  nms.run()

  nms.on('prePublish', async (id, StreamPath, args) => {
    const streamKey = getStreamKeyFromPath(StreamPath)
    console.log(`[NodeEvent on prePublish] id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`)
    const isAuthenticated = await authenticateStreamKey(streamKey)
    const user = await User.findOne({ streamkey: streamKey })
    if (!isAuthenticated) {
      let session = nms.getSession(id)
      session.reject()
      console.log(`Stream with key ${streamKey} rejected`)
    } else {
      console.log(`Stream with key ${streamKey} accepted`)
      await recordUserStatus(user.name, true)
    }
  })

  nms.on('donePublish', async (id, StreamPath, args) => {
    console.log(`[${id}] [donePublish] ${StreamPath}`)
    const streamKey = getStreamKeyFromPath(StreamPath)
    const user = await User.findOne({ streamkey: streamKey })
    await redisService.del(user.name)
  })
}

const getStreamKeyFromPath = (path) => {
  let parts = path.split('/')
  return parts[parts.length - 1]
}

const authenticateStreamKey = async (streamKey) => {
  try {
    const user = await User.findOne({ streamkey: streamKey })
    return user !== null
  } catch (err) {
    console.error('Error authenticating stream key:', err)
    return false
  }
}

const recordUserStatus = async (username, isLive) => {
  await redisService.set(username, isLive ? 'true' : 'false')
}

module.exports = {
  startNMS,
}