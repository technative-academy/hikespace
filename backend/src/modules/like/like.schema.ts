import { integer, serial, pgTable, text } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { postTable } from "#db/schema.js";
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

export const likeRelations = relations(likeTable, ({one}) => ({
  user: one(user, {
    fields: [likeTable.user_id],
    references: [user.id]
  }),
 posts: one(postTable, {
    fields: [likeTable.post_id],
    references: [postTable.id]
  })
}));
