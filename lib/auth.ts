import { betterAuth } from "better-auth";
import { Pool } from "pg";

const dialect = new Pool({
  connectionString: "postgresql://postgres:password@localhost:5432/database",
});

export const auth = betterAuth({
  database: { dialect, type: "postgresql" },
  baseURL: "http://localhost:3000/",
});
