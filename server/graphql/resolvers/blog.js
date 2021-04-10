const Blog = require('../../models/blog');
const User = require('../../models/user');
const Like = require('../../models/like');
const Comment = require('../../models/comment');
const World = require('../../models/world');
const { generateTerrain } = require('../../utils/worldGeneration');
const { runBlogListeners, pushBlogListener } = require('../../listeners/blogListeners');
const { validateId, validatePosition, sanitizeString } = require('../../utils/validate');

const updateTerrain = () => {
    // generate more terrain if too many blogs
    Blog.countDocuments({}).then(function(count) {
        World.findOne({}).then(function(world) {
            if(count > world.size*10) {
                generateTerrain();
            }
        });
    });
};

const updateUsers = (blogPosition) => {
    // update all the users within 100 radius of a blog
    return User.find({
        position: {
            $near: blogPosition,
            $maxDistance: 100
        }
    })
    .then(function(users) {
        users.forEach((user) => {
            runBlogListeners(user._id);
        })
    })
    .catch(function(err) {
        throw err;
    });
};

module.exports = {
    blogs: function({ first, after, blogId, authorId }, { req, res }) {
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

        let filter = {};
        if (blogId) {
            if (!validateId(blogId)) {
                res.status(400);
                throw new Error("Invalid blog ID");
            }
            filter._id = sanitizeString(blogId);
        }
        if (authorId) {
            if (!validateId(authorId)) {
                res.status(400);
                throw new Error("Invalid author ID");
            }
            filter.author = sanitizeString(authorId);
        }

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
    numBlogs: function({ authorId }, { req, res }) {
        if (!req.isAuth) {
            res.status(401);
            throw new Error("Unauthorized access");
        }

        let filter = {};
        if (authorId) {
            if (!validateId(authorId)) {
                res.status(400);
                throw new Error("Invalid author ID");
            }
            filter.author = sanitizeString(authorId);
        }

        return Blog.countDocuments(filter)
            .then(function(count) {
                return count;
            })
            .catch(function(err) {
                throw err;
            })
    },
    blogsNearUser: function({ limit, long }, { req, res }) {
        if (!req.isAuth) {
            res.status(401);
            throw new Error("Unauthorized access");
        }
        if (limit > 20) {
            res.status(400);
            throw new Error("Cannot query more than 20 results");
        }

        const getBlogs = () => {
            return User.findOne({ _id: req.userId })
                .then(function(user) {
                    return Blog.find({
                        position: {
                            $near: user.position,
                            $maxDistance: 100
                        }
                    })
                    .limit(limit);
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
                });
        }

        if (!long) {
            return getBlogs();
        } else {
            return pushBlogListener(req.userId, getBlogs)
                .then(function(blogs) {
                    return blogs;
                })
                .catch(function(err) {
                    throw err;
                });
        }
    },
    createBlog: function({ title, content, position }, { req, res }) {
        if (!req.isAuth) {
            res.status(401);
            throw new Error("Unauthorized access");
        }
        if (!validatePosition(position)) {
            res.status(400);
            throw new Error("Invalid position: position must be of [Int, Int]");
        }
        const cleanedTitle = sanitizeString(title);
        const cleanedContent = sanitizeString(content);

        return User.findOne({ _id: req.userId })
            .then(function(user) {
                if (!user) {
                    res.status(404);
                    throw new Error(`User with id ${req.userId} does not exists`);
                }
                const blog = new Blog({
                    title: cleanedTitle,
                    content: cleanedContent,
                    author: user._id,
                    date: new Date(),
                    position: position
                });
                return blog.save();
            })
            .then(function(savedBlog) {
                return User.populate(savedBlog, [{ path: "author" }]);
            })
            .then(function(populatedBlog) {
                updateUsers(populatedBlog.position);
                updateTerrain();
                populatedBlog.author.password = null;
                return populatedBlog;
            })
            .catch(function(err) {
                throw err;
            });
    },
    deleteBlog: function({ blogId }, { req, res }) {
        if (!req.isAuth) {
            res.status(401);
            throw new Error("Unauthorized access");
        }
        if (!validateId(blogId)) {
            res.status(400);
            return new Error("Invalid blog ID");
        }
        const cleanedBlogId = sanitizeString(blogId);

        return Blog.findOne({ _id: cleanedBlogId })
            .then(function(blog) {
                if (!blog) {
                    res.status(404);
                    throw new Error(`Blog with id ${cleanedBlogId} does not exist`);
                } else if (blog.author != req.userId) {
                    res.status(403);
                    throw new Error("Forbidden access: Cannot delete other people's blog");
                }

                return Blog.deleteOne({ _id: cleanedBlogId })
                    .then(function(result) {
                        if (result.deletedCount <= 0) throw new Error("Failed to delete blog");
                        
                        updateUsers(blog.position);
                        return Like.deleteMany({ blog: cleanedBlogId });
                    })
            })
            .then(function(result) {
                return Comment.deleteMany({ blog: cleanedBlogId });
            })
            .then(function(result) {
                return true;
            })
            .catch(function(err) {
                throw err;
            });
    }
};