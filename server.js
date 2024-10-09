import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import express from "express";
import cors from "cors";
import { typeDefs } from "./schema/typeDefs.js";
import { resolvers } from "./schema/resolvers.js";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

// Utils
import { createToken } from "./utils/createToken.js";

dotenv.config(); // dotenv
connectDB(); // connecting database

const app = express();

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

await server.start();

app.use(
  "/graphql",
  cors(),
  express.json(),
  expressMiddleware(server, {
    context: async ({ req }) => {
      return createToken(req);
    },
  })
);

app.listen(4000, () => {
  console.log(`🚀 Server ready at http://localhost:4000/graphql`);
});
