const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blogSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
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

module.exports = mongoose.model('Blog', blogSchema);