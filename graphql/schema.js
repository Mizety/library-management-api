const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID!
    name: String!
    email: String!
    password: String
  }

  type Book {
    _id: ID!
    title: String!
    author: String!
    ISBN: String!
    publicationDate: String!
    genre: String
    copies: Int!
  }

  type AuthData {
    userId: ID!
    token: String!
    tokenExpiration: Int!
  }

  input UserInput {
    name: String!
    email: String!
    password: String!
  }

  input BookInput {
    title: String!
    author: String!
    ISBN: String!
    publicationDate: String!
    genre: String
    copies: Int!
  }

  type Query {
    users: [User!]!
    books: [Book!]!
  }

  type Mutation {
    createUser(userInput: UserInput): User
    createBook(bookInput: BookInput): Book
    login(email: String!, password: String!): AuthData
 
  }
`;

module.exports = typeDefs;
