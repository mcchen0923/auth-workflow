const mongoose = require('mongoose');
const User = require('../models/user'); // 假設 user 模型在 ./models/user
const connectDB = require('../db/connect')
const crypto = require('crypto');
require('dotenv').config()

const updateUserStreamKeys = async () => {
    try {
        const users = await User.find();
        for (const user of users) {
            user.streamkey = "stream_" + crypto.randomBytes(16).toString('hex');
            console.log(user)
            await user.save();
        }
        console.log('All users have been updated with stream keys');
    } catch (err) {
        console.error('Error updating stream keys:', err);
    } finally {
        mongoose.connection.close();
    }
};

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        updateUserStreamKeys();
    } catch (error) {
        console.log(error)
    }
}

start()