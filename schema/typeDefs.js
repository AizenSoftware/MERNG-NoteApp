// schema/typeDefs.js
import { gql } from "graphql-tag";

export const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    notes: [Note]
  }

  type Note {
    id: ID!
    title: String!
    description: String!
    userId: ID!
    user: User!
  }
  type Query {
    getUser(id: ID!): User # Bir kullanıcıyı ID'sine göre getirir
    getNotes: [Note] # Tüm notları getirir
  }

  type Auth {
    message: String!
    user: User!
  }
  type Message {
    message: String!
  }

  type Query {
    getNotes: [Note]
  }

  type Mutation {
    register(name: String!, email: String!, password: String!): Message!
    login(email: String!, password: String!): Auth!
    createNote(title: String!, description: String!): Note!
  }
`;
