const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const imageSchema = new Schema({
    fileName: {
        type: String,
        required: true
    },
    originalName: {
        type: String,
        required: true
    },
    mimetype: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        required: true
    },
    path: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Image', imageSchema);