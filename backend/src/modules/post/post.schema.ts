import {
  geometry,
  text,
  integer,
  serial,
  pgTable,
  varchar
} from "drizzle-orm/pg-core";
import { userTable } from "../user/user.schema.js";

export const postTable = pgTable("Post", {
  id: serial().primaryKey(),
  owner_id: integer()
    .notNull()
    .references(() => userTable.id),
  description: text().notNull(),
  route: geometry("path", { type: "Linestring", srid: 4326 }).notNull(),
  location_name: varchar({ length: 255 }).notNull(),
  caption: varchar({ length: 100 }).notNull()
});
