import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "@shared/schema";

const databaseUrl = process.env.DATABASE_URL;

export const isDbConfigured = Boolean(databaseUrl);

export const pool = databaseUrl
  ? new Pool({
      connectionString: databaseUrl,
    })
  : null;

export const db = pool ? drizzle(pool, { schema }) : null;

let hasLoggedUnavailableDb = false;

export async function checkDatabaseConnection(): Promise<boolean> {
  if (!pool) {
    if (!hasLoggedUnavailableDb) {
      console.warn(
        "[db] DATABASE_URL is not set. Running in degraded mode with in-memory storage.",
      );
      hasLoggedUnavailableDb = true;
    }
    return false;
  }

  try {
    await pool.query("select 1");
    return true;
  } catch (error) {
    console.error(
      "[db] Failed to connect to PostgreSQL. Falling back to in-memory storage.",
      error,
    );
    return false;
  }
}
