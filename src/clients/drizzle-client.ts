// src/clients/drizzle-client.ts
import "server-only";
import { DrizzleConfig, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { z } from "zod";

import * as schema from "../db/schema";
import * as relations from "../db/relations";

const SUPABASE_DATABASE_URL = z.url().parse(process.env.DATABASE_URL!);

// Configuration setup
const config = {
  casing: "snake_case",
  schema: { ...schema, ...relations },
} satisfies DrizzleConfig<typeof schema & typeof relations>;

// Create both admin and RLS-protected clients
export const adminClient = drizzle({
  client: postgres(SUPABASE_DATABASE_URL, { prepare: false }),
  ...config,
});

export const rlsClient = drizzle({
  client: postgres(SUPABASE_DATABASE_URL, { prepare: false }),
  ...config,
});
