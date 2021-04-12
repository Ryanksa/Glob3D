const Comment = require('../../models/comment');
const User = require('../../models/user');
const Blog = require('../../models/blog');
const { validateId, sanitizeString } = require('../../utils/validate');

module.exports = {
    comments: function({ first, after, commentId, userId, blogId }, { req, res }) {
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
        if (commentId) {
            if (!validateId(commentId)) {
                res.status(400);
                throw new Error("Invalid comment ID");
            }
            filter._id = sanitizeString(commentId);
        }
        if (userId) {
            if (!validateId(userId)) {
                res.status(400);
                throw new Error("Invalid user ID");
            }
            filter.user = sanitizeString(userId);
        };
        if (blogId) {
            if (!validateId(blogId)) {
                res.status(400);
                throw new Error("Invalid blog ID");
            }
            filter.blog = sanitizeString(blogId);
        };

        return Comment.find(filter).sort({"date": -1}).skip(after).limit(first)
            .populate("user")
            .populate("blog")
            .then(function(comments) {
                comments.map(function(comment) {
                    comment.user.password = null;
                    // TODO: populate comment.blog.author
                    return comment;
                });
                return comments;
            })
            .catch(function(err) {
                throw err;
            });
    },
    numComments: function({ userId, blogId }, { req, res }) {
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
        };
        if (blogId) {
            if (!validateId(blogId)) {
                res.status(400);
                throw new Error("Invalid blog ID");
            }
            filter.blog = sanitizeString(blogId);
        };

        return Comment.countDocuments(filter)
            .then(function(count) {
                return count;
            })
            .catch(function(err) {
                throw err;
            });
    },
    addComment: function({ blogId, content }, { req, res }) {
        if (!req.isAuth) {
            res.status(401);
            throw new Error("Unauthorized access");
        }

        if (!validateId(blogId)) {
            res.status(400);
            throw new Error("Invalid blog ID");
        }
        const cleanedBlogId = sanitizeString(blogId);
        const cleanedContent = sanitizeString(content);

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
                const comment = new Comment({
                    user: req.userId,
                    blog: cleanedBlogId,
                    content: cleanedContent,
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
                comment.user.password = null;
                // TODO: populate comment.blog.author
                return comment;
            })
            .catch(function(err) {
                throw err;
            });
    },
    deleteComment: function({ commentId }, { req, res }) {
        if (!req.isAuth) {
            res.status(401);
            throw new Error("Unauthorized access");
        }

        if (!validateId(commentId)) {
            res.status(400);
            throw new Error("Invalid comment ID");
        }
        const cleanedCommentId = sanitizeString(commentId);

        return Comment.findById(cleanedCommentId)
            .then(function(comment){
                if(!comment){
                    res.status(404);
                    throw new Error(`Comment with id ${cleanedCommentId} does not exist`);
                }
                if(comment.user != req.userId){
                    res.status(403);
                    throw new Error("Forbidden access: Cannot delete other people's comment");
                }
                // remove commment
                return Comment.deleteOne({_id : cleanedCommentId});
            })
            .then(function (result){
                return result.deletedCount !== 0;
            }) 
            .catch(function(err) {
                throw err;
            });
    }
};