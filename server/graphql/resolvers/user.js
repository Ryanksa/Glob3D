const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/user');
const config = require('../../config');

module.exports = {
    users: function({ first, after }, req) {
        if (!req.isAuth) throw new Error("Unauthorized access");
        return User.find().skip(after).limit(first)
            .then(function(users) {
                return users.map(function(user) {
                    user.password = null;
                    return user;
                });
            })
            .catch(function(err) {
                throw err;
            });
    },
    signin: function({ email, password }) {
        return User.findOne({ email: email })
            .then(function(user) {
                if (!user) return new Error("Invalid email or password");
                return bcrypt.compare(password, user.password)
                    .then(function(isValid) {
                        if (!isValid) return new Error("Invalid email or password");
                        return jwt.sign({ userId: user._id }, config.jwtSecret, { expiresIn: "4h" });
                    });
            })
            .catch(function(err) {
                throw err;
            });
    },
    signup: function({ email, password, name }) {
        return User.findOne({ email: email })
            .then(function(existingUser) {
                if (existingUser) throw new Error(`User with email ${existingUser.email} already exists`);
                return bcrypt.genSalt(10);
            })
            .then(function(salt) {
                return bcrypt.hash(password, salt);
            })
            .then(function(hash) {
                const user = new User({
                    email: email,
                    password: hash,
                    name: name,
                    date: new Date()
                });
                return user.save();
            })
            .then(function(savedUser) {
                savedUser.password = null;
                return savedUser;
            })
            .catch(function(err) {
                throw err;
            });
    }
};