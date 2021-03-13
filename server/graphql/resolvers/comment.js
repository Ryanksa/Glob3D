const Comment = require('../../models/comment');
const User = require('../../models/user');
const Blog = require('../../models/blog');

module.exports = {
    comments: function({ first, after }, { req }) {
        if (!req.isAuth) throw new Error("Unauthorized access");
        return Comment.find().skip(after).limit(first)
            .populate("user")
            .populate("blog")
            .then(function(comments) {
                return comments;
            })
            .catch(function(err) {
                throw err;
            });
    },
    addComment: function({ blogId, content }, { req }) {
        if (!req.isAuth) throw new Error("Unauthorized access");
        return User.findOne({ _id: req.userId })
            .then(function(user) {
                if (!user) throw new Error(`User with id ${req.userId} does not exist`);
                return Blog.findOne({ _id: blogId });
            })
            .then(function(blog) {
                if (!blog) throw new Error(`Blog with id ${blogId} does not exist`);
                const comment = new Comment({
                    user: req.userId,
                    blog: blogId,
                    content: content,
                    date: new Date()
                });
                return comment.save();
            })
            .then(function(comment) {
                return User.populate(comment, [{ path: "user" }]);
            })
            .then(function(comment) {
                return Blog.populate(comment, [{ path: "blog" }]);
            })
            .then(function(comment) {
                return comment;
            })
            .catch(function(err) {
                throw err;
            });
    }
};