const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')


// create json web token
const maxAge = 24 * 60 * 60
const createToken = (id) => {
    return jwt.sign({ id }, 'secretkeyhere', {
        expiresIn: maxAge
    })
}

const createUser = async (req, res) => {
    const streamkey = "stream_" + crypto.randomBytes(16).toString('hex')
    const data = {
        name: req.body.username,
        password: req.body.password,
        streamkey: streamkey
    }
    const existingUser = await User.findOne({ name: data.name })
    if (existingUser) {
        console.log('Try another name')
        let errors = { name: 'Try another name', password: '' }
        res.status(400).json({ errors })
    }
    else {
        const saltRounds = 10
        const hashedPassword = await bcrypt.hash(data.password, saltRounds)
        data.password = hashedPassword
        const userdata = await User.create(data)
        console.log(userdata)
        const token = createToken(userdata._id)
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })
        res.status(201).json({ user: userdata._id })
    }
}

const userLogIn = async (req, res) => {
    let errors = { name: '', password: '' }
    try {
        const check = await User.findOne({ name: req.body.username })
        if (!check) {
            errors.name = 'User name cannot found'
            return res.status(400).json({ errors })
        }
        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password)
        if (isPasswordMatch) {
            const token = createToken(check._id)
            res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })
            return res.status(200).json({ user: check._id })
        } else {
            errors.password = 'wrong password'
            return res.status(400).json({ errors })
        }

    } catch {

        res.send("wrong detail")
    }

}
const GetAllGamers = async (req, res) => {
    const users = await User.find().select({ name: 1 , avatar : 1})
    res.render('gamers', { users })
}
const LogOutGet = async (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 })
    res.redirect('/')
}

const LoginGet = async (req, res) => {
    res.render("login")
}
const SignUpGet = async (req, res) => {
    res.render("signup")
}
const GetProfile = async (req, res) => {
    const token = req.cookies.jwt
    console.log(token)
    if (token) {
        jwt.verify(token, 'secretkeyhere', async (err, decodedToken) => {
            if (err) {
                console.log(err.message)
                
            } else {
                let user = await User.findById(decodedToken.id)
                return res.render('profile', user)
            }
        })
    } else {
        res.status(400)
    }
}

const authenticateStreamKey = async (streamkey) => {
    try {
        const user = await User.findOne({ streamkey: streamKey })
        return user !== null
      } catch (err) {
        console.error('Error authenticating stream key:', err)
        return false
      }
}

module.exports = {
    userLogIn,
    createUser,
    LoginGet,
    SignUpGet,
    LogOutGet,
    GetAllGamers,
    GetProfile,
    authenticateStreamKey,
}