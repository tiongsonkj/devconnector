const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create schema
// all fields are required
// Date.now gives us the current date
const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    },
});

// exporting model with name "users"
module.exports = User = mongoose.model('users', UserSchema);