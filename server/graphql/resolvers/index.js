const authResolver = require('./user');
const blogResolver = require('./blog');
const likeResolver = require('./like');
const commentResolver = require('./comment');
const followResolver = require('./follow');

module.exports = {
    ...authResolver,
    ...blogResolver,
    ...likeResolver,
    ...commentResolver,
    ...followResolver
};
