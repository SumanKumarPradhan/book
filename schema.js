const { buildSchema } = require('graphql');

const schema = buildSchema(`
    type Book {
        _id: ID!
        title: String!
        author: String!
        available: Boolean!
        owner: User
    }

    type User {
        _id: ID!
        username: String!
        role: String!
    }

    type AuthData {
        userId: ID!
        token: String!
        tokenExpiration: Int!
    }

    input BookInput {
        title: String!
        author: String!
    }

    input UserInput {
        username: String!
        password: String!
    }

    type Query {
        books: [Book!]!
        users: [User!]!
        login(username: String!, password: String!): AuthData!
    }

    type Mutation {
        addBook(bookInput: BookInput!): Book!
        register(userInput: UserInput!): User!
    }
`);

module.exports = schema;
