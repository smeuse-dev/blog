import { Pool } from 'pg';

export const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '6432'),
  database: process.env.DB_NAME || 'smeuse',
  user: process.env.DB_USER || 'smeuse',
  password: process.env.DB_PASSWORD || 'smeuse_fox_2026',
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});
