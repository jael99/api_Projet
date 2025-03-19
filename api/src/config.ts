import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT ?? '3000';
export const REST_PATH = process.env.REST_PATH ?? '/v1';
export const GRAPHQL_PATH = process.env.GRAPHQL_PATH ?? '/v2';
export const STATUS_PATH = process.env.STATUS_PATH ?? '/status';
export const METRICS_PATH = process.env.METRICS_PATH ?? '/metrics';
export const DATABASE_URL = process.env.DATABASE_URL;
export const JWT_SECRET = process.env.JWT_SECRET;
