import { serial, pgTable, integer, text } from "drizzle-orm/pg-core";
import { postTable } from "../post/post.schema.js";
import { user } from "#db/schema.js";

export const participTable = pgTable("participation", {
  id: serial("id").primaryKey(),
  user_id: text()
    .notNull()
    .references(() => user.id),
  post_id: integer()
    .notNull()
    .references(() => postTable.id)
});
