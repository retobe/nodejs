const mongoose = require("mongoose");

// Define the User schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    sessionToken: {
        type: String,
    },
    sessionExpiration: {
        type: Date,
    },
    balance: {
        type: Number,
        default: 0,
    },
    multiplier: {
        type: Number,
        default: 1
    }
});

const sessionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    token: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '7d',
    },
});

const User = mongoose.model('LogUsers', userSchema);
const Session = mongoose.model('Session', sessionSchema);

module.exports = {
    User,
    Session,
};