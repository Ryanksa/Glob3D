const Blog = require('../../models/blog');
const User = require('../../models/user');
const Like = require('../../models/like');
const Comment = require('../../models/comment');

module.exports = {
    blogs: function({ first, after }, req) {
        if (!req.isAuth) throw new Error("Unauthorized access");
        return Blog.find().skip(after).limit(first)
            .populate("author")
            .then(function(blogs) {
                return blogs;
            })
            .catch(function(err) {
                throw err;
            });
    },
    createBlog: function({ title, content }, req) {
        if (!req.isAuth) throw new Error("Unauthorized access");
        return User.findOne({ _id: req.userId })
            .then(function(user) {
                if (!user) throw new Error(`User with id ${req.userId} does not exists`);
                const blog = new Blog({
                    title: title,
                    content: content,
                    author: user._id,
                    date: new Date()
                });
                return blog.save();
            })
            .then(function(savedBlog) {
                return User.populate(savedBlog, [{ path: "author" }]);
            })
            .then(function(populatedBlog) {
                populatedBlog.author.password = null;
                return populatedBlog;
            })
            .catch(function(err) {
                throw err;
            });
    },
    deleteBlog: function({ blogId }, req) {
        if (!req.isAuth) throw new Error("Unauthorized access");
        return Blog.findOne({ _id: blogId })
            .then(function(blog) {
                if (!blog) throw new Error(`Blog with id ${blogId} does not exist`);
                if (blog.author !== req.userId) throw new Error("Unauthorized access");
                return User.populate(blog, [{ path: "author" }]);
            })
            .then(function(populatedBlog) {
                return Blog.deleteOne({ _id: blogId })
                    .then(function(result) {
                        if (result.deletedCount <= 0) throw new Error("Failed to delete blog");
                        return Like.deleteMany({ blog: blogId });
                    })
                    .then(function(result) {
                        return Comment.deleteMany({ blog: blogId });
                    })
                    .then(function(result) {
                        return populatedBlog;
                    });
            })
            .catch(function(err) {
                throw err;
            });
    }
};