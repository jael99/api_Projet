import express from "express";
import { PORT, GRAPHQL_PATH } from "./config";
import logger from "./utils/logger";
import pool from "./utils/db";
import { metricsMiddleware } from "./utils/metrics";
import { graphqlHandler } from "./utils/graphql";
import { setupSwagger } from "./utils/swagger";
import router from "./router";

const MAX_RETRIES = 5;
const RETRY_DELAY = 5000; 


/**
 * Tries to establish a connection to the database.
 * Retries up to MAX_RETRIES if it fails.
 */
async function checkDbConnection(retries = 0) {
  try {
    const connection = await pool.getConnection();
    logger.info("Database connected successfully!");
    connection.release();
  } catch (error) {
    if (retries < MAX_RETRIES) {
      retries++; 
      logger.warn(`Attempt ${retries}/${MAX_RETRIES} failed. Retrying in ${RETRY_DELAY / 1000}s...`);
      setTimeout(() => checkDbConnection(retries), RETRY_DELAY); 
    } else {
      logger.error(`Database connection failed ${MAX_RETRIES} `);
      logger.error(`The server will start, but database-dependent routes may fail until the DB is available.`);
    }
  }
}

async function startServer() {
  console.log("Checking database connection...");
  checkDbConnection(); 

  console.log("Initializing Express app...");
  const app = express();
  app.use(express.json());

  console.log("Setting up Prometheus metrics...");
  app.use(metricsMiddleware);

  console.log("Configuring Swagger documentation...");
  setupSwagger(app);

  console.log("Setting up GraphQL API...");
  app.use(GRAPHQL_PATH, graphqlHandler(true));

  console.log("Registering API routes...");
  app.use("/", router);

  console.log(`🚀 Starting server on port ${PORT}...`);
  app.listen(PORT, () => {
    logger.info(`Server running on http://localhost:${PORT}`);
    logger.info(`Swagger : http://localhost:${PORT}/docs`);
    logger.info(`Database info: http://localhost:${PORT}/info`);
  });
}

startServer();
