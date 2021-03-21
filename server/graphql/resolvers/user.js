const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookie = require('cookie');
const User = require('../../models/user');
const config = require('../../config');

module.exports = {
    users: function({ first, after }, { req }) {
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
    signin: function({ email, password }, { req, res }) {
        if (req.isAuth) throw new Error("Sign out first before signing in");
        return User.findOne({ email: email })
            .then(function(user) {
                if (!user) return new Error("Invalid email or password");
                return bcrypt.compare(password, user.password)
                    .then(function(isValid) {
                        if (!isValid) return new Error("Invalid email or password");
                        // sign a jsonwebtoken and attach it to response cookie
                        const token = jwt.sign({ userId: user._id }, config.jwtSecret, { expiresIn: "4h" });
                        res.setHeader("Set-Cookie", cookie.serialize("token", token, {
                            path: "/",
                            maxAge: 60 * 60 * 4 // 4hours
                        }));
                        return user;
                    });
            })
            .catch(function(err) {
                throw err;
            });
    },
    signout: function(args, { res }) {
        res.setHeader("Set-Cookie", cookie.serialize("token", "", {
            path: "/",
            maxAge: 0
        }));
        return true;
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