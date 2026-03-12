import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { user } from "../../db/schema.js";
import { PostSchema } from "#modules/post/post.zod.js";
import { likeSchema } from "#modules/like/like.zod.js";
import { participSchema } from "#modules/participation/particip.zod.js";
import { followSchema } from "#modules/following/follow.zod.js";

export const userSelectSchema = createSelectSchema(user);
const UserRelationSchema = userSelectSchema.pick({
  id: true,
  name: true,
  email: true,
  emailVerified: true,
  image: true,
  createdAt: true,
  updatedAt: true
});

const MeUserLikeSchema = likeSchema.extend({
  posts: PostSchema
});

const MeUserParticipationSchema = participSchema.extend({
  user: UserRelationSchema
});

const MeUserFollowerSchema = followSchema.extend({
  followed: UserRelationSchema
});

const MeUserFollowingSchema = followSchema.extend({
  follower: UserRelationSchema
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

export const MeUserSchema = userSelectSchema
  .pick({
    id: true,
    name: true,
    email: true,
    image: true
  })
  .extend({
    followersCount: z.number().int().nonnegative().default(0),
    followingCount: z.number().int().nonnegative().default(0),
    posts: z.array(PostSchema),
    likes: z.array(MeUserLikeSchema),
    particips: z.array(MeUserParticipationSchema),
    followers: z.array(MeUserFollowerSchema),
    followings: z.array(MeUserFollowingSchema)
  });

export const setAvatarSchema = z.object({
  imageKey: z.string().min(1).nullable()
});

export type UserRow = z.infer<typeof userSelectSchema>;
export type PublicUser = z.infer<typeof PublicUserSchema>;
export type MeUser = z.infer<typeof MeUserSchema>;
