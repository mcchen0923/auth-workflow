const User = require('../models/user')
const bcrypt = require('bcrypt');

const createUser = async (req, res) => {
    const data = {
        name: req.body.username,
        password: req.body.password
    }
    const existingUser = await User.findOne({ name: data.name })
    if (existingUser) {
        return res.render('check', { title: 'Try another name' });
    }
    else {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(data.password, saltRounds)

        data.password = hashedPassword

        const userdata = await User.insertMany(data);
        console.log(userdata)
        return res.render('check', { title: 'Welcome' });
    }
}

const userLogIn = async (req, res) => {
    try {
        const check = await User.findOne({ name: req.body.username })
        if (!check) {
            return res.render('check', { title: 'User name cannot found' });
        }
        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password)
        if (isPasswordMatch) {
            return res.render("Home")
        } else {
            return res.render('check', { title: 'wrong password' });
        }

    } catch {

        res.send("wrong detail")
    }

}

module.exports = {
    userLogIn,
    createUser,
}