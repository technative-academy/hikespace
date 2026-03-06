import { integer, serial, pgTable } from "drizzle-orm/pg-core";
import { userTable } from "../user/user.schema.js";
import { postTable } from "../post/post.schema.js";

export const likeTable = pgTable("like", {
  id: serial().primaryKey(),
  post_id: integer()
    .notNull()
    .references(() => postTable.id),
  user_id: integer()
    .notNull()
    .references(() => userTable.id)
});
