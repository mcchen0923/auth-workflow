const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'need something'],
        trim:true,
        maxlength:[20,'can not more than 20'],
        unique: true
    },
    password:{
        type:String,
        required:[true,'need something'],
        minLength:6
    },
    streamkey:{
        type:String,
    },
    avatar:{
        type:String,
    }
})

module.exports = mongoose.model('User', UserSchema)