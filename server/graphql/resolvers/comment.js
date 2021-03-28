const Comment = require('../../models/comment');
const User = require('../../models/user');
const Blog = require('../../models/blog');

module.exports = {
    comments: function({ first, after, userId, blogId }, { req }) {
        if (!req.isAuth) throw new Error("Unauthorized access");
        if (first > 20) throw new Error("Cannot query more than 20 results");
        
        let filter = {};
        if (userId) filter.user = userId;
        if (blogId) filter.blog = blogId;

        return Comment.find(filter).skip(after).limit(first)
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
    numComments: function({ userId, blogId }, { req }) {
        if (!req.isAuth) throw new Error("Unauthorized access");
        let filter = {};
        if (userId) filter.user = userId;
        if (blogId) filter.blog = blogId;

        return Comment.countDocuments(filter)
            .then(function(count) {
                return count;
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
                comment.user.password = null;
                // TODO: populate comment.blog.author
                return comment;
            })
            .catch(function(err) {
                throw err;
            });
    },
    deleteComment: function({ commentId }, { req }) {
        if (!req.isAuth) throw new Error("Unauthorized access");
        return Comment.findById(commentId)
            .then(function(comment){
                if(!comment){
                    throw new Error(`Comment with id ${commentId} does not exist`);
                }
                if(comment.user != req.userId){
                    throw new Error(`Author with id ${req.userId} did not post the comment`);
                }
                // remove commment
                return Comment.deleteOne({_id : commentId});
            })
            .then(function (result){
                return result.deletedCount !== 0;
            }) 
            .catch(function(err) {
                throw err;
            });
    }
};