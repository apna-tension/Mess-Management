const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    verificationCode: {
        type: String,
        required: false, // Make it optional for existing users
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);