require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const { json } = require("body-parser");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");

const connectDB = require("./config/db");
const taskRoutes = require("./routes/task-routes");
const authRoutes = require("./routes/auth-routes");
const errorHandler = require("./middleware/error-handler");
const typeDefs = require("./graphql/schema");
const resolvers = require("./graphql/resolver");
const limiter = require("./middleware/rate-limiter");
const throttle = require("./middleware/ip-throttler");

const app = express();
app.use(json());

// ip-based rate limiting
app.use(limiter);

// ip-based throttling
app.use(throttle);

// connect to database
connectDB();

// morgan logging
app.use(morgan(":method :url :res[content-length] - :response-time ms"));

// rest api
app.use("/tasks", taskRoutes);

// auth routes
app.use("/auth", authRoutes);

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
