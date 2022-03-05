// blog listeners for users to long poll updates on blogs
const blogListeners = {};

module.exports = {
    pushBlogListener: function(userId, callback) {
        return new Promise(function(resolve, reject) {
            // timeout this blog listener after 10mins
            function blogTimeout() {
                if (blogListeners[userId]) {
                    blogListeners[userId].shift();
                }
                return resolve(null);
            }
            setTimeout(blogTimeout, 600000);

            // wrap callback in function to return promise resolve/reject
            const notify = () => {
                clearTimeout(blogTimeout);
                if (blogListeners[userId]) {
                    callback().then(function(blogs) {
                        return resolve(blogs);
                    }).catch(function(err) {
                        return reject(err);
                    });
                }
            };
            // push to blog listeners
            if (!blogListeners[userId]) {
                blogListeners[userId] = [];
            }
            blogListeners[userId].push(notify);
        });
    },
    runBlogListeners: function(userId) {
        if (blogListeners[userId]) {
            blogListeners[userId].forEach((callback) => callback());
            delete blogListeners[userId];
        }
    }
};