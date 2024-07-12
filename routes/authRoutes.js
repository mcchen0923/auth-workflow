const express = require('express')
const router = express.Router()

const { userLogIn,
    createUser, 
    LoginGet,
    SignUpGet,
    LogOutGet} = require('../controllers/authController')

router.get("/", (req, res) => {
    res.render("home")
})


router.route('/login').get(LoginGet).post(userLogIn)
router.route('/signup').get(SignUpGet).post(createUser)
router.route('/logout').get(LogOutGet)
module.exports = router