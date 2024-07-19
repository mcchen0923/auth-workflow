const express = require('express')
const router = express.Router()
const {
    getChannel,
  } = require('../controllers/chanController');
  
router.route('/:username').get(getChannel)
module.exports = router