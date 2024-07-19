const User = require('../models/user')

const getChannel = async (req, res) => {
    try {
        const check = await User.findOne({ name: req.params.username })
        if (!check) {
            return res.render('user_chan', { username: 'User name cannot found' });
        }
        return res.render('user_chan', { username: check.name });

    } catch {
        res.send("wrong detail")
    }
}

module.exports = {
    getChannel,
}