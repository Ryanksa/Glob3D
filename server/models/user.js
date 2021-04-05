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
    position: {
        type: [Number],
        required: true
    }
});
// 50 * (9 + 2000) = 100450 (i.e. allow terrain to expand 1000 times)
userSchema.index({ position: '2d' }, { min: -100450, max: 100450 })

module.exports = mongoose.model('User', userSchema);