const express = require('express')
const router = express.Router()
const {
    getChannel,
    getStreamUrl,
    getLiveStatus,
  } = require('../controllers/chanController')
  
router.route('/:username').get(getChannel)
router.route('/stream/:username').get(getStreamUrl)
router.route('/api/user/:username/live-status').get(getLiveStatus)
module.exports = router