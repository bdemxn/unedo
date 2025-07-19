import { env } from "@/lib/env";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/database/schemas/index.ts",
  out: "./src/database/migrations",

  dbCredentials: {
    url: env.DATABASE_URL
  }
});