const mongoose = require('mongoose');
const MONGO_URL = process.env.MONGO_URL;

const connectDatabase = () => {
    mongoose.connect(MONGO_URL)
    .then(()=>{console.log('database connected')})
    .catch(()=>{console.log('connection error')})
}


module.exports = connectDatabase;