import { serial, pgTable, integer, text } from "drizzle-orm/pg-core";
import { userTable } from "../user/user.schema.js";
import { postTable } from "../post/post.schema.js";

export const participTable = pgTable("participation", {
  id: serial("id").primaryKey(),
  user_id: text()
    .notNull()
    .references(() => userTable.id),
  post_id: integer()
    .notNull()
    .references(() => postTable.id)
});
