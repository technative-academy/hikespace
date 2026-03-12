import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { user } from "../../db/schema.js";

export const userSelectSchema = createSelectSchema(user);

export const UserRelationSchema = userSelectSchema.pick({
  id: true,
  name: true,
  image: true
});

export const PublicUserSchema = userSelectSchema
  .pick({
    id: true,
    name: true,
    image: true
  })
  .extend({
    followersCount: z.number().int().nonnegative().default(0),
    followingCount: z.number().int().nonnegative().default(0),
    isFollowed: z.boolean().default(false)
  });
