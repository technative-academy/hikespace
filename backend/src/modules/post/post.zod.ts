import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { postTable } from "../../db/schema.js";

export const PostSchema = createSelectSchema(postTable);

export const CreatePostSchema = createInsertSchema(postTable).omit({
  id: true,
  owner_id: true
});

export type Post = z.infer<typeof PostSchema>;
export type CreatePostBody = z.infer<typeof CreatePostSchema>;
export type CreatePostDto = CreatePostBody & { owner_id: number };
