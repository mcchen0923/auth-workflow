const User = require('../models/user')
const redisService = require('../services/redisService')

const getChannel = async (req, res) => {
    try {
        const user = await User.findOne({ name: req.params.username })
        if (!user) {
            return res.render('user_chan', { username: 'User name cannot found' })
        }
        return res.render('user_chan', { username: user.name, avatar: user.avatar })

    } catch {
        res.send("wrong detail")
    }
}
const getStreamUrl = async (req, res) => {
    const username = req.params.username
    const status = await redisService.get(username)
    try {
        const user = await User.findOne({ name: username })
        if (!user || !user.streamkey) {
            return res.status(404).send('User or stream not found')
        }
        const streamUrl = `http://localhost:8000/live/${user.streamkey}/index.m3u8`
        res.json({ streamUrl })
    } catch (err) {
        console.error('Error fetching user stream:', err)
        res.status(500).send('Internal server error')
    }
}

const getLiveStatus = async (req, res) => {
    const username = req.params.username
    try {
        const status = await redisService.get(username)
        res.json({ live: status === 'true' })
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

module.exports = {
    getChannel,
    getStreamUrl,
    getLiveStatus,
}