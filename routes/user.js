const express = require('express')
const router = express.Router()


router.get("/", (req, res) => {
    res.render("login")
})

router.get("/signup", (req, res) => {

    res.render("signup")
})

const { userLogIn,
    createUser } = require('../controllers/users')

router.route('/login').post(userLogIn)
router.route('/signup').post(createUser)
module.exports = router