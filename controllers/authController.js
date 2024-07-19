const User = require('../models/user')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')


// create json web token
const maxAge = 24 * 60 * 60;
const createToken = (id) => {
    return jwt.sign({ id }, 'secretkeyhere', {
        expiresIn: maxAge
    });
};

const createUser = async (req, res) => {
    const data = {
        name: req.body.username,
        password: req.body.password
    }
    const existingUser = await User.findOne({ name: data.name })
    if (existingUser) {
        console.log('Try another name')
        let errors = { name: 'Try another name', password: '' }
        res.status(400).json({ errors })
    }
    else {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(data.password, saltRounds)
        data.password = hashedPassword
        const userdata = await User.create(data);
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
//          return res.render('check', { title: 'User name cannot found' });
        }
        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password)
        if (isPasswordMatch) {
            const token = createToken(check._id)
            res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })
            return res.status(200).json({ user: check._id })
        } else {
            console.log(check)
            errors.password = 'wrong password'
            return res.status(400).json({ errors })
        }

    } catch {

        res.send("wrong detail")
    }

}
const GetAllGamers = async (req, res) => {
    const users = await User.find().select({name: 1})
    res.render('gamers', {users});
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

module.exports = {
    userLogIn,
    createUser,
    LoginGet,
    SignUpGet,
    LogOutGet,
    GetAllGamers,
}