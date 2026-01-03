import { drizzle } from "drizzle-orm/neon-serverless"
import { Pool } from "@neondatabase/serverless"
import { env } from "../env"
import * as schema from "./schema"

// Create connection pool
const pool = new Pool({ connectionString: env.DATABASE_URL })

// Export database instance
export const db = drizzle(pool, { schema })

// Export schema
export { schema }

// - Import neon serverless driver
// - Create drizzle instance
// - Export db
