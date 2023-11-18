const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    firstName: { type: String },
    lastName: { type: String },
    mobile: { type: String },
    address: { type: String },
    profile: { type: String }
});

module.exports = mongoose.model('user', userSchema);
