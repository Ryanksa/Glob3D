const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookie = require('cookie');
const User = require('../../models/user');
const Blog = require('../../models/blog');
const config = require('../../config');
const { runBlogListeners } = require('../../listeners/blogListeners');
const { validateEmail, validatePassword, validatePosition, sanitizeString } = require('../../utils/validate');

module.exports = {
    users: function({ first, after }, { req, res }) {
        if (!req.isAuth) {
            res.status(401);
            throw new Error("Unauthorized access");
        } else if (first > 20) {
            res.status(400);
            throw new Error("Cannot query more than 20 results");
        } else if (after < 0) {
            res.status(400);
            throw new Error("Cannot skip by a negative amount");
        }

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
    getUserPosition: function(args, { req, res }) {
        if (!req.isAuth) {
            res.status(401);
            throw new Error("Unauthorized access");
        }

        return User.findOne({ _id: req.userId })
            .then(function(user) {
                if (!user) {
                    res.status(404);
                    throw new Error(`User with id ${req.userId} does not exist`);
                }
                return user.position;
            })
            .catch(function(err) {
                throw err;
            })
    },
    signin: function({ email, password }, { res }) {
        if (!validateEmail(email)) {
            res.status(400);
            throw new Error("Invalid email syntax");
        }
        const cleanedEmail = sanitizeString(email);
        const cleanedPassword = sanitizeString(password);

        // check if user with email exists first
        return User.findOne({ email: cleanedEmail })
            .then(function(user) {
                if (!user) {
                    res.status(401);
                    return new Error("Invalid email or password");
                }

                // validate the password against the salted hash stored on db
                return bcrypt.compare(cleanedPassword, user.password)
                    .then(function(isValid) {
                        if (!isValid) {
                            res.status(401);
                            return new Error("Invalid email or password");
                        }

                        // sign a jsonwebtoken and attach it to response cookie
                        const token = jwt.sign({ userId: user._id }, config.jwtSecret, { expiresIn: "24h" });
                        res.setHeader("Set-Cookie", cookie.serialize("token", token, {
                            path: "/",
                            maxAge: 60 * 60 * 24, // 1day
                            httpOnly: true,
                            secure: process.env.HTTPS ? true : false, // only use secure flag if behind https
                            sameSite: true
                        }));
                        user.password = null;
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
    signup: function({ email, password, name }, { res }) {
        if (!validateEmail(email)) {
            res.status(400);
            throw new Error("Invalid email syntax");
        }
        if (!validatePassword(password)) {
            res.status(400);
            throw new Error("Password must be 10 characters or longer");
        }
        const cleanedEmail = sanitizeString(email);
        const cleanedPassword = sanitizeString(password);
        const cleanedName = sanitizeString(name);

        return User.findOne({ email: cleanedEmail })
            .then(function(existingUser) {
                if (existingUser) {
                    res.status(409);
                    throw new Error(`User with email ${existingUser.email} already exists`);
                }
                return bcrypt.genSalt(10);
            })
            .then(function(salt) {
                return bcrypt.hash(cleanedPassword, salt);
            })
            .then(function(hash) {
                const user = new User({
                    email: cleanedEmail,
                    password: hash,
                    name: cleanedName,
                    date: new Date(),
                    position: [0, 0]
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
    },
    updateUserPosition: function({ position }, { req, res }) {
        if (!req.isAuth) {
            res.status(401);
            throw new Error("Unauthorized access");
        }
        if (!validatePosition(position)) {
            res.status(400);
            throw new Error("Invalid position: position must be of [Int, Int]");
        }

        return User.updateOne({ _id: req.userId }, { $set: { position: position } })
            .then(function(result) {
                runBlogListeners(req.userId);
                return true;
            })
            .catch(function(err) {
                throw err;
            });
    }
};