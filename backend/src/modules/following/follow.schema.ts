import { user } from "#db/schema.js";
import {
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  unique
} from "drizzle-orm/pg-core";

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
