import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { likeTable } from "../../db/schema.js";

export const likeSchema = createSelectSchema(likeTable);

export const createLikeSchema = createInsertSchema(likeTable).omit({
  id: true
});

export type Like = z.infer<typeof likeSchema>;
export type CreateLikeDto = z.infer<typeof createLikeSchema>;
