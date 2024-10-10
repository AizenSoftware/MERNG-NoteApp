import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import express from "express";
import http from "http";
import cors from "cors";
import { typeDefs } from "./schema/typeDefs.js";
import { resolvers } from "./schema/resolvers.js";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
// Utils

dotenv.config(); // dotenv
connectDB(); // connecting database
const app = express();
const httpServer = http.createServer(app);

const corsOptions = {
  origin: "http://localhost:5173", // Frontend'in çalıştığı URL
  credentials: true, // Cookie'leri gönder
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  cors: corsOptions, // CORS ayarlarını buraya ekliyoruz
});
await server.start();
app.use(cookieParser()); // Cookie-parser middleware ekle

app.use(
  "/graphql",
  cors(corsOptions),
  express.json(),
  expressMiddleware(server, {
    context: async ({ req, res }) => {
      return { req, res };
    },
  })
);

app.listen(4000, () => {
  console.log(`🚀 Server ready at http://localhost:4000/graphql`);
});
