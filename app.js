const express = require("express");
const bodyParser = require("body-parser");
const { ApolloServer } = require("apollo-server-express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const bookRoutes = require("./routes/bookRoutes");
const borrowRoutes = require("./routes/borrowRoutes");
const dotenv = require("dotenv");
const typeDefs = require("./graphql/schema");
const resolvers = require("./graphql/resolvers");

dotenv.config();
connectDB();

const app = express();
app.use(bodyParser.json());

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const token = req.headers.authorization || "";
    return { token };
  },
});

const startApolloServer = async () => {
  await server.start();
  server.applyMiddleware({ app });
};

startApolloServer().catch((err) => {
  console.error("Failed to start the server", err);
});
// REST API routes
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/borrows", borrowRoutes);

module.exports = app;
