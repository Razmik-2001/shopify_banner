const mongoose = require('mongoose');
require('dotenv').config();

const {MONGO_URL} = process.env;

const connectDB = async () => {
    try{
        await mongoose.connect(MONGO_URL);
        console.log('MongoDB Connected!');
    }catch(err){
        console.log('mongodb connection failed');
        process.exit(1);
    }
}
module.exports = connectDB;