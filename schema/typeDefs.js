// schema/typeDefs.js
import { gql } from "graphql-tag";

export const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    isAdmin: Boolean!
    notes: [Note]
  }

  type Note {
    id: ID!
    title: String!
    description: String!
    user: User!
  }
  type Auth {
    message: String
    token: String!
  }

  type Query {
    getUser(id: ID!): User # Bir kullanıcıyı ID'sine göre getirir
    getNotes: [Note] # Tüm notları getirir
    getUserNotes(userId: ID!): [Note]! # Belirli bir kullanıcının notlarını getirir
  }

  type Mutation {
    register(name: String!, email: String!, password: String!): Auth!
    login(email: String!, password: String!): Auth!
    createNote(title: String!, description: String!, userId: ID!): Note!
    updateNote(id: ID!, title: String!, description: String!): Note!
  }
`;
