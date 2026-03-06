import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { postTable } from "../../db/schema.js";

const LineStringGeoJSON = z.object({
  type: z.literal("LineString"),
  coordinates: z
    .array(z.tuple([z.number(), z.number()])) // [lng, lat]
    .min(2)
});

export const PostSchema = createSelectSchema(postTable, {
  route: LineStringGeoJSON
});
export const CreatePostSchema = createInsertSchema(postTable, {
  route: LineStringGeoJSON
}).omit({
  id: true,
  owner_id: true
});
export const UpdatePostSchema = CreatePostSchema.partial().strict();

export type Post = z.infer<typeof PostSchema>;
export type CreatePostBody = z.infer<typeof CreatePostSchema>;
export type CreatePostDto = CreatePostBody & { owner_id: string };
export type UpdatePostDto = z.infer<typeof UpdatePostSchema>;
