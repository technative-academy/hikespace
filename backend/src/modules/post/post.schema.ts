import { imageTable, participTable, user } from "#db/schema.js";
import {
  text,
  serial,
  pgTable,
  varchar,
  customType
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm"; 
import { likeTable } from "#db/schema.js"

const lineString4326 = customType<{ data: unknown; driverData: unknown }>({
  dataType() {
    return "geometry(LineString, 4326)";
  }
});

export const postTable = pgTable("post", {
  id: serial().primaryKey(),
  owner_id: text()
    .notNull()
    .references(() => user.id),
  description: text().notNull(),
  route: lineString4326("path").notNull(),
  location_name: varchar({ length: 255 }).notNull(),
  caption: varchar({ length: 100 }).notNull()
});

export const postRelations = relations(postTable, ({ one, many }) => ({
  owner: one(user, {
    fields: [postTable.owner_id],
    references: [user.id]
  }),
  likes: many(likeTable),
  images: many(imageTable),  
  particips: many(participTable)
}));
