const Like = require('../../models/like');
const User = require('../../models/user');
const Blog = require('../../models/blog');
const { validateId, validateFirstAfter, sanitizeString } = require('../../utils/validate');

module.exports = {
    likes: function({ first, after, userId, blogId }, { req, res }) {
        if (!req.isAuth) {
            res.status(401);
            throw new Error("Unauthorized access");
        }
        if (!validateFirstAfter(first, after)) {
            res.status(400);
            throw new Error("Invalid first or after range: 0 < first <= 20, after >= 0");
        }
        
        let filter = {};
        if (userId) {
            if (!validateId(userId)) {
                res.status(400);
                throw new Error("Invalid user ID");
            }
            filter.user = sanitizeString(userId);
        }
        if (blogId) {
            if (!validateId(blogId)) {
                res.status(400);
                throw new Error("Invalid blog ID");
            }
            filter.blog = sanitizeString(blogId);
        }

        return Like.find(filter).skip(after).limit(first)
            .populate("user")
            .populate("blog")
            .then(function(likes) {
                likes.map(function(like) {
                    like.user.password = null;
                    // TODO: populate like.blog.author
                    return like;
                });
                return likes;
            })
            .catch(function(err) {
                throw err;
            });
    },
    numLikes: function({ userId, blogId }, { req, res }) {
        if (!req.isAuth) {
            res.status(401);
            throw new Error("Unauthorized access");
        }
        
        let filter = {};
        if (userId) {
            if (!validateId(userId)) {
                res.status(400);
                throw new Error("Invalid user ID");
            }
            filter.user = sanitizeString(userId);
        }
        if (blogId) {
            if (!validateId(blogId)) {
                res.status(400);
                throw new Error("Invalid blog ID");
            }
            filter.blog = sanitizeString(blogId);
        }

        return Like.countDocuments(filter)
            .then(function(count) {
                return count;
            })
            .catch(function(err) {
                throw err;
            })
    },
    likeBlog: function({ blogId }, { req, res }) {
        if (!req.isAuth) {
            res.status(401);
            throw new Error("Unauthorized access");
        }
        if (!validateId(blogId)) {
            res.status(400);
            throw new Error("Invalid blog ID");
        }
        const cleanedBlogId = sanitizeString(blogId);

        return User.findOne({ _id: req.userId })
            .then(function(user) {
                if (!user) {
                    res.status(404);
                    throw new Error(`User with id ${req.userId} does not exist`);
                }
                return Blog.findOne({ _id: cleanedBlogId });
            })
            .then(function(blog) {
                if (!blog) {
                    res.status(404);
                    throw new Error(`Blog with id ${cleanedBlogId} does not exist`);
                }
                return Like.findOne({ user: req.userId, blog: cleanedBlogId });
            })
            .then(function(isLiked) {
                if (isLiked) {
                    res.status(400);
                    throw new Error(`User ${req.userId} already liked blog ${cleanedBlogId}`);
                }
                const like = new Like({
                    user: req.userId,
                    blog: cleanedBlogId,
                    date: new Date()
                });
                return like.save();
            })
            .then(function(like) {
                return `User ${req.userId} liked blog ${cleanedBlogId}`;
            })
            .catch(function(err) {
                throw err;
            });
    },
    unlikeBlog: function({ blogId }, { req, res }) {
        if (!req.isAuth) {
            res.status(401);
            throw new Error("Unauthorized access");
        }
        if (!validateId(blogId)) {
            res.status(400);
            throw new Error("Invalid blog ID");
        }
        const cleanedBlogId = sanitizeString(blogId);

        return User.findOne({ _id: req.userId })
            .then(function(user) {
                if (!user) {
                    res.status(404);
                    throw new Error(`User with id ${req.userId} does not exist`);
                }
                return Blog.findOne({ _id: cleanedBlogId });
            })
            .then(function(blog) {
                if (!blog) {
                    res.status(404);
                    throw new Error(`Blog with id ${cleanedBlogId} does not exist`);
                }
                return Like.deleteOne({ user: req.userId, blog: cleanedBlogId });
            })
            .then(function(result) {
                if (result.deletedCount < 1) {
                    res.status(400);
                    throw new Error(`User ${req.userId} has not liked blog ${cleanedBlogId}`);
                }
                return `User ${req.userId} unliked blog ${cleanedBlogId}`;
            })
            .catch(function(err) {
                throw err;
            });
    }
};