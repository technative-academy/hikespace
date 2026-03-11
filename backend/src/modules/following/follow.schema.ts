import { user } from "#db/schema.js";
import {
  pgTable,
  primaryKey,
  text,
  timestamp
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const followTable = pgTable(
  "following",
  {
    follower_id: text("follower_id")
      .notNull()
      .references(() => user.id),

    following_id: text("following_id")
      .notNull()
      .references(() => user.id),

    created_at: timestamp("created_at").defaultNow().notNull()
  },
  (table) => [
    primaryKey({
      columns: [table.follower_id, table.following_id]
    })
  ]
);

export const followerUserRelations = relations(followTable, ({ one }) => ({
  follower: one(user, {
    fields: [followTable.follower_id],
    references: [user.id]
  }),
  followed: one(user, {
    fields: [followTable.following_id],
    references: [user.id]
  })
}));
