const blogListeners = {};

module.exports = {
    pushBlogListener: function(userId, callback) {
        blogListeners[userId] = callback;
    },
    runBlogListener: function(userId, blogs) {
        if (blogListeners[userId]) {
            blogListeners[userId](blogs);
        }
    },
    clearBlogListener: function(userId) {
        delete blogListeners[userId];
    }
};