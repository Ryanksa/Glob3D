const { buildSchema } = require('graphql');

module.exports = buildSchema(`
    type User {
        _id: ID!
        email: String!
        password: String
        name: String!
        date: String!
        position: [Int!]!
    }

    type Blog {
        _id: ID!
        title: String!
        content: [String!]!
        author: User!
        date: String!
        position: [Int!]!
    }

    type Like {
        user: User!
        blog: Blog!
        date: String!
    }

    type Comment {
        _id: ID!
        user: User!
        blog: Blog!
        content: String!
        date: String!
    }

    type Follow {
        follower: User!
        followed: User!
        date: String!
    }

    type World {
        terrain: [[Int!]!]!
        size: Int
    }

    type RootQuery {
        users(first: Int!, after: Int!, userId: ID): [User!]!
        getUserPosition: [Int!]!
        blogs(first: Int!, after: Int!, blogId: ID, authorId: ID): [Blog!]!
        numBlogs(authorId: ID): Int!
        blogsNearUser(limit: Int!, long: Boolean): [Blog!]
        likes(first: Int!, after: Int!, userId: ID, blogId: ID): [Like!]!
        numLikes(userId: ID, blogId: ID): Int!
        comments(first: Int!, after: Int!, commentId: ID, userId: ID, blogId: ID): [Comment!]!
        numComments(userId: ID, blogId: ID): Int!
        follows(first: Int!, after: Int!, followerId: ID, followedId: ID): [Follow!]!
        numFollows(followerId: ID, followedId: ID): Int!
        signin(email: String!, password: String!): User!
        signout: Boolean!
        authenticateConnection: Boolean!
        world(long: Boolean): World
    }

    type RootMutation {
        signup(email: String!, password: String!, name: String!): User!
        updateUserPosition(position: [Int!]!): Boolean!
        createBlog(title: String!, content: [String!]!, position: [Int!]!): Blog!
        deleteBlog(blogId: ID!): Boolean!
        likeBlog(blogId: ID!): String!
        unlikeBlog(blogId: ID!): String!
        addComment(blogId: ID!, content: String!): Comment!
        deleteComment(commentId: ID!): Boolean!
        followUser(userId: ID!): String!
        unfollowUser(userId: ID!): String!
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);