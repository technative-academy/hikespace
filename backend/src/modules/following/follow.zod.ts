import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { followTable } from "../../db/schema.js";

export const followSchema = createSelectSchema(followTable);

export const createFollowSchema = createInsertSchema(followTable).omit({
  created_at: true
});

export type Follow = z.infer<typeof followSchema>;
export type CreateFollowDto = z.infer<typeof createFollowSchema>;
