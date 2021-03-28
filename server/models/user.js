const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    x: {
        type: Number,
        required: true
    },
    z: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('User', userSchema);