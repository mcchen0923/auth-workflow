const express = require('express')
const { requireAuth } = require('../middleware/authMiddleware');
const router = express.Router()

const { userLogIn,
    createUser, 
    LoginGet,
    SignUpGet,
    LogOutGet,
    GetAllGamers,
    GetProfile} = require('../controllers/authController')

router.get("/", (req, res) => {
    res.render("home")
})


router.route('/login').get(LoginGet).post(userLogIn)
router.route('/signup').get(SignUpGet).post(createUser)
router.route('/logout').get(LogOutGet)
router.route('/gamers').get(requireAuth, GetAllGamers)
router.route('/setting/profile').get(GetProfile)
module.exports = router