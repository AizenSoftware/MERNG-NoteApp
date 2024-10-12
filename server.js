import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import express from "express";
import http from "http";
import cors from "cors";
import cookieParser from "cookie-parser"; // Cookie-parser'ı ekle
import { typeDefs } from "./schema/typeDefs.js";
import { resolvers } from "./schema/resolvers.js";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import { auth } from "./utils/auth.js";

dotenv.config();
connectDB(); // Veritabanına bağlan

const app = express();
const httpServer = http.createServer(app);

// CORS ayarları
const corsOptions = {
  origin: "http://localhost:5173", // Frontend'in çalıştığı URL
  credentials: true, // Cookie gönderimini aktif et
};

// Apollo Server kurulum
const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

await server.start();
app.use(cors(corsOptions)); // CORS ayarlarını uygula
app.use(cookieParser()); // Cookie-parser middleware
app.use(express.json());
app.use(
  "/graphql",
  expressMiddleware(server, {
    context: async ({ req, res }) => {
      return { req, res };
    },
  })
);

// Sunucuyu başlat
httpServer.listen(4000, () => {
  console.log(`🚀 Server ready at http://localhost:4000/graphql`);
});
