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
    position: {
        type: [Number],
        required: true
    }
});
// 50 * (9 + 2000) = 100450 (i.e. allow terrain to expand 1000 times)
blogSchema.index({ position: '2d' }, { min: -100450, max: 100450 })

module.exports = mongoose.model('Blog', blogSchema);