const Follow = require('../../models/follow');
const User = require('../../models/user');

module.exports = {
    follows: function({ first, after, followerId, followedId }, { req }) {
        if (!req.isAuth) throw new Error("Unauthorized access");
        if (first > 20) throw new Error("Cannot query more than 20 results");
        
        let filter = {};
        if (followerId) filter.follower = followerId;
        if (followedId) filter.followed = followedId;

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
    numFollows: function({ followerId, followedId }, { req }) {
        if (!req.isAuth) throw new Error("Unauthorized access");
        let filter = {};
        if (followerId) filter.follower = followerId;
        if (followedId) filter.followed = followedId;

        return Follow.countDocuments(filter)
            .then(function(count) {
                return count;
            })
            .catch(function(err) {
                throw err;
            });
    },
    followUser: function({ userId }, { req }) {
        if (!req.isAuth) throw new Error("Unauthorized access");
        if (req.userId === userId) throw new Error("Cannot follow self");
        return User.findOne({ _id: req.userId })
            .then(function(follower) {
                if (!follower) throw new Error(`User with id ${req.userId} does not exist`);
                return User.findOne({ _id: userId });
            })
            .then(function(followed) {
                if (!followed) throw new Error(`User with id ${userId} does not exist`);
                return Follow.findOne({ follower: req.userId, followed: userId });
            })
            .then(function(isFollowing) {
                if (isFollowing) throw new Error(`User ${req.userId} is already following user ${userId}`);
                const follow = new Follow({
                    follower: req.userId,
                    followed: userId,
                    date: new Date()
                });
                return follow.save();
            })
            .then(function(follow) {
                return `User ${req.userId} is following user ${userId}`;
            })
            .catch(function(err) {
                throw err;
            });
    },
    unfollowUser: function({ userId }, { req }) {
        if (!req.isAuth) throw new Error("Unauthorized access");
        return User.findOne({ _id: req.userId })
            .then(function(follower) {
                if (!follower) throw new Error(`User with id ${req.userId} does not exist`);
                return User.findOne({ _id: userId });
            })
            .then(function(followed) {
                if (!followed) throw new Error(`User with id ${userId} does not exist`);
                return Follow.deleteOne({ follower: req.userId, followed: userId });
            })
            .then(function(result) {
                if (result.deletedCount < 1) throw new Error(`User ${req.userId} does not follow user ${userId}`);
                return `User ${req.userId} unfollowed user ${userId}`;
            })
            .catch(function(err) {
                throw err;
            });
    }
};