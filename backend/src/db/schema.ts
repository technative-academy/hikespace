import { serial, pgTable, varchar } from "drizzle-orm/pg-core";
import { z } from "zod";

export const userTable = pgTable("user", {
  id: serial("id").primaryKey(),
  email: varchar({ length: 255 }).notNull().unique(),
  username: varchar({ length: 20 }).notNull(),
  password_hash: varchar({ length: 60 }).notNull(),
  image_url: varchar({ length: 255 })
});
