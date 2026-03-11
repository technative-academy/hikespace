import { serial, pgTable, integer, text } from "drizzle-orm/pg-core";
import { postTable } from "../post/post.schema.js";
import { user } from "#db/schema.js";
import { relations } from "drizzle-orm";

export const participTable = pgTable("participation", {
  id: serial("id").primaryKey(),
  user_id: text()
    .notNull()
    .references(() => user.id),
  post_id: integer()
    .notNull()
    .references(() => postTable.id)
});

export const participRelations = relations(participTable, ({ one }) => ({
  user: one(user, {
    fields: [participTable.user_id],
    references: [user.id]
  }),
  post: one(postTable, {
    fields: [participTable.post_id],
    references: [postTable.id]
  })
}));
