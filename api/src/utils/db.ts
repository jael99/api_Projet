import mysql from "mysql2/promise";
import { DATABASE_URL } from "../config";

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}

const pool = mysql.createPool({
  host: "my_mysql",  // Nom du service Docker
  user: process.env.MYSQL_USER || "myuser",
  password: process.env.MYSQL_PASSWORD || "mypassword",
  database: process.env.MYSQL_DATABASE || "sakila",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // uri: DATABASE_URL,
  // waitForConnections: true,
  // connectionLimit: 10,
  // queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

//connection test 
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log("Successfully connected to the Sakila database!");
    connection.release();
    return true;
  } catch (error) {
    console.error("Database connection failed:", error);
    return false;
  }
}

testConnection();

export default pool;