import { fetchGraphql } from './fetchService';

const createComment = (blogId, content) => {
    return fetchGraphql(`
        mutation {
            addComment(blogId:"${blogId}", content:"${content}") {
                _id
            }
        }
    `);
};

const getComments = (blogId, first, after) => {
    return fetchGraphql(`
        query {
            comments(first: ${first}, after: ${after}, blogId: "${blogId}") {
                _id
                user {
                    name
                    email
                }
                content
                date
            }
        }
    `);
};

const countComments = (blogId) => {
    return fetchGraphql(`
        query {
            numComments(blogId: "${blogId}")
        }
    `);
};

export { createComment, getComments, countComments };