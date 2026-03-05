import { integer, serial, timestamp, pgTable } from "drizzle-orm/pg-core";
import { userTable } from "../user/user.schema.js";

export const followTable = pgTable("following", {
  id: serial().primaryKey(),
  follower_id: integer()
    .notNull()
    .references(() => userTable.id),
  created_at: timestamp().notNull()
});
