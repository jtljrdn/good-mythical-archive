import { pgTable, serial, text, varchar } from "drizzle-orm/pg-core";

export const users = pgTable('users', { // Example users table from Supabase docs
    id: serial('id').primaryKey(),
    fullName: text('full_name'),
    phone: varchar('phone', { length: 256 }),
  });