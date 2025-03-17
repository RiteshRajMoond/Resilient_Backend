require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const { json } = require("body-parser");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");

const connectDB = require("./config/db");
const taskRoutes = require("./routes/task-routes");
const errorHandler = require("./middleware/error-handler");
const typeDefs = require("./graphql/schema");
const resolvers = require("./graphql/resolver");

const app = express();
app.use(json());

// connect to database
connectDB();

// morgan logging
app.use(morgan("dev"));

// rest api
app.use("/tasks", taskRoutes);

// GraphQL API
async function startServer() {
  try {
    const server = new ApolloServer({ typeDefs, resolvers });
    await server.start();
    app.use("/graphql", expressMiddleware(server));

    const PORT = process.env.PORT || 9090;
    app.listen(PORT, () => console.log(`Server running on part ${PORT}`));
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

startServer();

// error handler
app.use(errorHandler);
