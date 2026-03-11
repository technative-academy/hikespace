import { integer, serial, pgTable, varchar } from "drizzle-orm/pg-core";
import { postTable } from "../post/post.schema.js";
import { relations } from "drizzle-orm";

export const imageTable = pgTable("image", {
  id: serial().primaryKey(),
  post_id: integer()
    .notNull()
    .references(() => postTable.id),
  image_url: varchar().notNull(),
  position: integer().notNull()
});

export const imageRelations = relations(imageTable, ({ one }) => ({
  post: one(postTable, {
    fields: [imageTable.post_id],
    references: [postTable.id]
  })
}));
