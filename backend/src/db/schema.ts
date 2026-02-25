import {
  text,
  integer,
  serial,
  pgTable,
  varchar,
  geometry
} from "drizzle-orm/pg-core";
export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  email: varchar({ length: 255 }).notNull().unique(),
  username: varchar({ length: 20 }).notNull(),
  password_hash: varchar({ length: 60 }).notNull(),
  image_url: varchar({ length: 255 })
});

export const postTable = pgTable("Post", {
  id: serial().primaryKey(),
  owner_id: integer()
    .notNull()
    .references(() => usersTable.id),
  description: text().notNull(),
  route: geometry("path", { type: "Linestring", srid: 4326 }).notNull(),
  location_name: varchar({ length: 255 }).notNull(),
  caption: varchar({ length: 100 }).notNull()
});
