const Blog = require('../../models/blog');
const User = require('../../models/user');
const Like = require('../../models/like');
const Comment = require('../../models/comment');
const World = require('../../models/world');
const { generateTerrain } = require('../../worldGeneration');

module.exports = {
    blogs: function({ first, after, authorId }, { req }) {
        if (!req.isAuth) throw new Error("Unauthorized access");
        if (first > 20) throw new Error("Cannot query more than 20 results");

        let filter = {};
        if (authorId) filter.author = authorId;

        return Blog.find(filter).skip(after).limit(first)
            .populate("author")
            .then(function(blogs) {
                blogs.map(function(blog) {
                    blog.author.password = null;
                    return blog;
                });
                return blogs;
            })
            .catch(function(err) {
                throw err;
            });
    },
    numBlogs: function({ authorId }, { req }) {
        if (!req.isAuth) throw new Error("Unauthorized access");
        let filter = {};
        if (authorId) filter.author = authorId;

        return Blog.countDocuments(filter)
            .then(function(count) {
                return count;
            })
            .catch(function(err) {
                throw err;
            })
    },
    blogsNearUser: function({ limit }, { req }) {
        if (!req.isAuth) throw new Error("Unauthorized access");
        if (limit > 20) throw new Error("Cannot query more than 20 results");

        return User.findOne({ _id: req.userId })
            .then(function(user) {
                return Blog.find({
                    $and: [
                        { x: { $gt: user.x-50 } },
                        { x: { $lt: user.x+50 } },
                        { z: { $gt: user.z-50 } },
                        { z: { $lt: user.z+50 } }
                    ]
                }, { title:1, content:1, author:1, date:1, x:1, z:1, limit: limit })
            })
            .then(function(blogs) {
                return User.populate(blogs, [{path: "author"}]);
            })
            .then(function(blogs) {
                blogs.map((blog) => {
                    blog.author.password = null;
                    return blog;
                });
                return blogs;
            })
            .catch(function(err) {
                throw err;
            })
    },
    createBlog: function({ title, content, position }, { req }) {
        if (!req.isAuth) throw new Error("Unauthorized access");
        return User.findOne({ _id: req.userId })
            .then(function(user) {
                if (!user) throw new Error(`User with id ${req.userId} does not exists`);
                const blog = new Blog({
                    title: title,
                    content: content,
                    author: user._id,
                    date: new Date(),
                    x: position[0],
                    z: position[1]
                });
                return blog.save();
            })
            .then(function(savedBlog) {
                return User.populate(savedBlog, [{ path: "author" }]);
            })
            .then(function(populatedBlog) {
                // generate more terrain if too many blogs
                Blog.countDocuments({}).then(function(count) {
                    World.findOne({}).then(function(world) {
                        if(count > world.size*10) {
                            generateTerrain();
                        }
                    });
                });
                populatedBlog.author.password = null;
                return populatedBlog;
            })
            .catch(function(err) {
                throw err;
            });
    },
    deleteBlog: function({ blogId }, { req }) {
        if (!req.isAuth) throw new Error("Unauthorized access");
        return Blog.findOne({ _id: blogId })
            .then(function(blog) {
                if (!blog) throw new Error(`Blog with id ${blogId} does not exist`);
                if (blog.author != req.userId) throw new Error("Unauthorized access");
                return Blog.deleteOne({ _id: blogId })
            })
            .then(function(result) {
                if (result.deletedCount <= 0) throw new Error("Failed to delete blog");
                return Like.deleteMany({ blog: blogId });
            })
            .then(function(result) {
                return Comment.deleteMany({ blog: blogId });
            })
            .then(function(result) {
                return true;
            })
            .catch(function(err) {
                throw err;
            });
    }
};