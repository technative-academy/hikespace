import { integer, serial, pgTable, text } from "drizzle-orm/pg-core";
import { postTable } from "../post/post.schema.js";
import { user } from "#db/schema.js";

export const likeTable = pgTable("like", {
  id: serial().primaryKey(),
  post_id: integer()
    .notNull()
    .references(() => postTable.id),
  user_id: text()
    .notNull()
    .references(() => user.id)
});
