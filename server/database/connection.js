const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')
require('dotenv').config()
async function connect() {
    const mongodb = new MongoMemoryServer()
    await mongodb.start()
    const mongo_URI = mongodb.getUri()
    // const db = await mongoose.connect(mongo_URI)
    const db = process.env.MONGODB_URI
    console.log("mongodb connected")
    return db


}

module.exports = connect