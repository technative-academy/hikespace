import { integer, serial, pgTable, varchar } from "drizzle-orm/pg-core";
import { postTable } from "../post/post.schema.js";

export const imageTable = pgTable("Image", {
  id: serial().primaryKey(),
  post_id: integer()
    .notNull()
    .references(() => postTable.id),
  image_url: varchar({ length: 255 }).notNull(),
  position: integer().notNull()
});
