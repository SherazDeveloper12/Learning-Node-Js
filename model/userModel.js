const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        trim: true
    },
    email: { type: String, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    address: String,
    createdAt: { type: Date, default: Date.now }

});
const User = mongoose.model('User', userSchema);
module.exports = { User };