import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { postTable } from "../../db/schema.js";
import { ImageSchema } from "#modules/image/image.zod.js";
import { UserRelationSchema } from "#modules/user/user.base.zod.js";

const LineStringGeoJSON = z.object({
  type: z.literal("LineString"),
  coordinates: z
    .array(z.tuple([z.number(), z.number()])) // [lng, lat]
    .min(2)
});

export const PostSchema = createSelectSchema(postTable, {
  route: LineStringGeoJSON
});

export const PostPopulatedSchema = PostSchema.extend({
  likes: z.number().int().nonnegative(),
  images: z.array(ImageSchema),
  participations: z.array(UserRelationSchema)
});

export const CreatePostSchema = createInsertSchema(postTable, {
  route: LineStringGeoJSON
}).omit({
  id: true,
  owner_id: true
});

export const UpdatePostSchema = CreatePostSchema.partial().strict();

export type Post = z.infer<typeof PostSchema>;
export type PopulatedPost = z.infer<typeof PostPopulatedSchema>;
export type CreatePostBody = z.infer<typeof CreatePostSchema>;
export type CreatePostDto = CreatePostBody & { owner_id: string };
export type UpdatePostDto = z.infer<typeof UpdatePostSchema>;
