const { buildSchema } = require('graphql');

module.exports = buildSchema(`
    type User {
        _id: ID!
        email: String!
        password: String
        name: String!
        date: String!
    }

    type Blog {
        _id: ID!
        title: String!
        content: String!
        author: User!
        date: String!
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

    type RootQuery {
        users(first: Int!, after: Int!): [User!]!
        blogs(first: Int!, after: Int!): [Blog!]!
        likes(first: Int!, after: Int!): [Like!]!
        comments(first: Int!, after: Int!): [Comment!]!
        follows(first: Int!, after: Int!): [Follow!]!
        signin(email: String!, password: String!): Boolean!
        signout: Boolean!
    }

    type RootMutation {
        signup(email: String!, password: String!, name: String!): User!
        createBlog(title: String!, content: String!): Blog!
        deleteBlog(blogId: ID!): Blog!
        likeBlog(blogId: ID!): String!
        unlikeBlog(blogId: ID!): String!
        addComment(blogId: ID!, content: String!): Comment!
        followUser(userId: ID!): String!
        unfollowUser(userId: ID!): String!
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);