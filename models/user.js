const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'need somrthing'],
        trim:true,
        maxlength:[20,'can not more than 20']
    },
    password:{
        type:String,
        required:[true,'need somrthing']
    }
})

module.exports = mongoose.model('User', UserSchema)