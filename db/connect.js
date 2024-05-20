const mongoose = require('mongoose')

const connectDB = (url) => {
    console.log ("connectDB")
    return mongoose.connect(url)
}

module.exports = connectDB