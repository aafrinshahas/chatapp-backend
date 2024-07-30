const mongoose = require('mongoose')

const MessageSchema = new mongoose.Schema({
    message: String
}, {timestamps: true})

 const MessageModel = mongoose.model('Message', MessageSchema)

 module.exports = MessageModel
