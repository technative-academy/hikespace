import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { postTable } from "../../db/schema.js";

export const PostSchema = createSelectSchema(postTable);

export const CreatePostSchema = createInsertSchema(postTable);

export type Post = z.infer<typeof PostSchema>;
export type CreatePostDto = z.infer<typeof CreatePostSchema>;
