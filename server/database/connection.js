const mongoose = require('mongoose');
require('dotenv').config();

async function connect() {
    const mongo_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/test-database';

    try {
        const db = await mongoose.connect(mongo_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log("MongoDB connected");
        return db;
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error;
    }
}

module.exports = connect;
