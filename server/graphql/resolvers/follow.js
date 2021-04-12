const Follow = require('../../models/follow');
const User = require('../../models/user');
const { validateId, validateFirstAfter, sanitizeString } = require('../../utils/validate');

module.exports = {
    follows: function({ first, after, followerId, followedId }, { req, res }) {
        if (!req.isAuth) {
            res.status(401);
            throw new Error("Unauthorized access");
        }
        if (!validateFirstAfter(first, after)) {
            res.status(400);
            throw new Error("Invalid first or after range: 0 < first <= 20, after >= 0");
        }
        
        let filter = {};
        if (followerId) {
            if (!validateId(followerId)) {
                res.status(400);
                throw new Error("Invalid follower ID");
            }
            filter.follower = sanitizeString(followerId);
        }
        if (followedId) {
            if (!validateId(followedId)) {
                res.status(400);
                throw new Error("Invalid followed ID");
            }
            filter.followed = sanitizeString(followedId);
        }

        return Follow.find(filter).skip(after).limit(first)
            .populate("follower")
            .populate("followed")
            .then(function(follows) {
                follows.map(function(follow) {
                    follow.follower.password = null;
                    follow.followed.password = null;
                    return follow;
                });
                return follows;
            })
            .catch(function(err){
                throw err;
            });
    },
    numFollows: function({ followerId, followedId }, { req, res }) {
        if (!req.isAuth) {
            res.status(401);
            throw new Error("Unauthorized access");
        }

        let filter = {};
        if (followerId) {
            if (!validateId(followerId)) {
                res.status(400);
                throw new Error("Invalid follower ID");
            }
            filter.follower = sanitizeString(followerId);
        }
        if (followedId) {
            if (!validateId(followedId)) {
                res.status(400);
                throw new Error("Invalid followed ID");
            }
            filter.followed = sanitizeString(followedId);
        }

        return Follow.countDocuments(filter)
            .then(function(count) {
                return count;
            })
            .catch(function(err) {
                throw err;
            });
    },
    followUser: function({ userId }, { req, res }) {
        if (!req.isAuth) {
            res.status(401);
            throw new Error("Unauthorized access");
        }
        if (!validateId(userId)) {
            res.status(400);
            throw new Error("Invalid user ID");
        }
        if (req.userId === userId) {
            res.status(400);
            throw new Error("Cannot follow self");
        }
        const cleanedUserId = sanitizeString(userId);

        return User.findOne({ _id: req.userId })
            .then(function(follower) {
                if (!follower) {
                    res.status(404);
                    throw new Error(`User with id ${req.userId} does not exist`);
                }
                return User.findOne({ _id: cleanedUserId });
            })
            .then(function(followed) {
                if (!followed) {
                    res.status(404);
                    throw new Error(`User with id ${cleanedUserId} does not exist`);
                }
                return Follow.findOne({ follower: req.userId, followed: cleanedUserId });
            })
            .then(function(isFollowing) {
                if (isFollowing) {
                    res.status(400);
                    throw new Error(`User ${req.userId} is already following user ${cleanedUserId}`);
                }
                const follow = new Follow({
                    follower: req.userId,
                    followed: cleanedUserId,
                    date: new Date()
                });
                return follow.save();
            })
            .then(function(follow) {
                return `User ${req.userId} is following user ${cleanedUserId}`;
            })
            .catch(function(err) {
                throw err;
            });
    },
    unfollowUser: function({ userId }, { req, res }) {
        if (!req.isAuth) {
            res.status(401);
            throw new Error("Unauthorized access");
        }
        if (!validateId(userId)) {
            res.status(400);
            throw new Error("Invalid user ID");
        }
        const cleanedUserId = sanitizeString(userId);

        return User.findOne({ _id: req.userId })
            .then(function(follower) {
                if (!follower) {
                    res.status(404);
                    throw new Error(`User with id ${req.userId} does not exist`);
                }
                return User.findOne({ _id: cleanedUserId });
            })
            .then(function(followed) {
                if (!followed) {
                    res.status(404);
                    throw new Error(`User with id ${cleanedUserId} does not exist`);
                }
                return Follow.deleteOne({ follower: req.userId, followed: cleanedUserId });
            })
            .then(function(result) {
                if (result.deletedCount < 1) {
                    res.status(400);
                    throw new Error(`User ${req.userId} does not follow user ${cleanedUserId}`);
                }
                return `User ${req.userId} unfollowed user ${cleanedUserId}`;
            })
            .catch(function(err) {
                throw err;
            });
    }
};