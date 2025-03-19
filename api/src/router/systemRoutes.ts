import express from "express";
import { STATUS_PATH, METRICS_PATH } from "../config";
import { client } from "../utils/metrics";
import pool from "../utils/db";
import { RowDataPacket } from "mysql2/promise";

const router = express.Router();

/**
 * @swagger
 * /info:
 *   get:
 *     summary: Check database connection status
 *     tags: [System]
 *     responses:
 *       200:
 *         description: Database connection status
 */
router.get("/info", async (_req, res) => {
  try {
    const connection = await pool.getConnection();
    const [result] = await connection.query<RowDataPacket[]>("SELECT 1 as connected");
    connection.release();

    res.json({
      status: "connected",
      dbInfo: {
        connected: result[0].connected === 1,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Database connection check failed:", error);
    res.status(503).json({
      status: "disconnected",
      error: "Database not reachable",
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * @swagger
 * /status:
 *   get:
 *     summary: Get API status
 *     tags: [System]
 *     responses:
 *       200:
 *         description: API status
 */
router.get(STATUS_PATH, (_req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

/**
 * @swagger
 * /metrics:
 *   get:
 *     summary: Get Prometheus metrics
 *     tags: [System]
 *     responses:
 *       200:
 *         description: Metrics data
 */
router.get(METRICS_PATH, async (_req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.send(await client.register.metrics());
});

export default router;
