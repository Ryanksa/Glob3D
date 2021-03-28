const userResolver = require('./user');
const blogResolver = require('./blog');
const likeResolver = require('./like');
const commentResolver = require('./comment');
const followResolver = require('./follow');
const worldResolver = require('./world');

module.exports = {
    ...userResolver,
    ...blogResolver,
    ...likeResolver,
    ...commentResolver,
    ...followResolver,
    ...worldResolver
};
