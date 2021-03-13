const Like = require('../../models/like');
const User = require('../../models/user');
const Blog = require('../../models/blog');

module.exports = {
    likes: function({ first, after }, { req }) {
        if (!req.isAuth) throw new Error("Unauthorized access");
        return Like.find().skip(after).limit(first)
            .populate("user")
            .populate("blog")
            .then(function(likes) {
                return likes;
            })
            .catch(function(err) {
                throw err;
            });
    },
    likeBlog: function({ blogId }, { req }) {
        if (!req.isAuth) throw new Error("Unauthorized access");
        return User.findOne({ _id: req.userId })
            .then(function(user) {
                if (!user) throw new Error(`User with id ${req.userId} does not exist`);
                return Blog.findOne({ _id: blogId });
            })
            .then(function(blog) {
                if (!blog) throw new Error(`Blog with id ${blogId} does not exist`);
                return Like.findOne({ user: req.userId, blog: blogId });
            })
            .then(function(isLiked) {
                if (isLiked) throw new Error(`User ${req.userId} already liked blog ${blogId}`);
                const like = new Like({
                    user: req.userId,
                    blog: blogId,
                    date: new Date()
                });
                return like.save();
            })
            .then(function(like) {
                return `User ${req.userId} liked blog ${blogId}`;
            })
            .catch(function(err) {
                throw err;
            });
    },
    unlikeBlog: function({ blogId }, { req }) {
        if (!req.isAuth) throw new Error("Unauthorized access");
        return User.findOne({ _id: req.userId })
            .then(function(user) {
                if (!user) throw new Error(`User with id ${req.userId} does not exist`);
                return Blog.findOne({ _id: blogId });
            })
            .then(function(blog) {
                if (!blog) throw new Error(`Blog with id ${blogId} does not exist`);
                return Like.deleteOne({ user: req.userId, blog: blogId });
            })
            .then(function(result) {
                if (result.deletedCount < 1) throw new Error(`User ${req.userId} has not liked blog ${blogId}`);
                return `User ${req.userId} unliked blog ${blogId}`;
            })
            .catch(function(err) {
                throw err;
            });
    }
};