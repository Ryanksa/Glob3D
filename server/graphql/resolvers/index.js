const authResolver = require('./user');
const blogResolver = require('./blog');
const likeResolver = require('./like');
const commentResolver = require('./comment');
const followResolver = require('./follow');
const worldResolver = require('./world');

module.exports = {
    ...authResolver,
    ...blogResolver,
    ...likeResolver,
    ...commentResolver,
    ...followResolver,
    ...worldResolver
};
