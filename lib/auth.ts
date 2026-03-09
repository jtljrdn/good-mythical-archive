import { betterAuth } from "better-auth";
import { apiKey } from "@better-auth/api-key";
import { admin } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@/src/db/schema";

const client = drizzle({
  client: postgres(process.env.DATABASE_URL!, { prepare: false }),
  schema,
});

export const auth = betterAuth({
  database: drizzleAdapter(client, {
    provider: "pg",
    usePlural: false,
  }),
  plugins: [apiKey(), admin()],
});
