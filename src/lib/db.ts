import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "@/database/schemas";
import { Pool } from "pg";
import { env } from "./env";

const client = new Pool({ connectionString: env.DATABASE_URL });
export const db = drizzle({ client, schema });
