const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    name: String,
    room: String,
    date: {type: Date, default: Date.now()}
}, {timestamps: true})

 const UserModel = mongoose.model('User', UserSchema)

 module.exports = UserModel
