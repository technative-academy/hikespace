import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { user } from "../../db/schema.js";

export const userSelectSchema = createSelectSchema(user);

export const PublicUserSchema = userSelectSchema.pick({
  id: true,
  name: true,
  image: true
}).extend({
  followersCount: z.number().int().nonnegative().default(0),
  followingCount: z.number().int().nonnegative().default(0),
  isFollowed: z.boolean().default(false)
});

export const MeUserSchema = userSelectSchema.pick({
  id: true,
  name: true,
  email: true,
  image: true
});

export const setAvatarSchema = z.object({
  imageKey: z.string().min(1).nullable()
});

export type UserRow = z.infer<typeof userSelectSchema>;
export type PublicUser = z.infer<typeof PublicUserSchema>;
