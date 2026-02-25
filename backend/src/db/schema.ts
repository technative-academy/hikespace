import { integer, pgTable, varchar } from "drizzle-orm/pg-core";
export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  email: varchar({ length: 255 }).notNull().unique(),
  username: varchar({ length: 20 }).notNull(),
  password_hash: varchar({ length: 60 }).notNull(),
  image_url: varchar({ length: 255 })
});
