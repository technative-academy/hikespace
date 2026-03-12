import { db } from "#db/db.js";
import { followTable, participTable, user } from "#db/schema.js";
import { and, eq, exists, sql } from "drizzle-orm";
import {
  MeUser,
  MeUserSchema,
  PublicUser,
  PublicUserSchema,
  UserRow,
  userSelectSchema
} from "./user.zod.js";

export class UserRepository {
  async getById(id: string): Promise<MeUser | null> {
    const row = await db.query.user.findFirst({
      where: (u, { eq }) => eq(u.id, id),
      with: {
        posts: true,
        likes: {
          with: {
            posts: true
          }
        },
        particips: {
          with: {
            user: true
          }
        },
        followers: {
          with: {
            followed: true
          }
        },
        followings: {
          with: {
            follower: true
          }
        }
      },
      columns: {
        id: true,
        name: true,
        email: true,
        image: true
      },
      extras: (u) => ({
        followersCount: sql<number>`
        (
          select CAST(count(*) AS int)
          from "following"
          where "following"."following_id"= ${u.id}
        )
      `.as("followersCount"),

        followingCount: sql<number>`
        (
          select CAST(count(*) AS int)
          from ${followTable}
          where "following"."follower_id" = ${u.id}
        )
      `.as("followingCount")
      })
    });
    console.log(row);

    return row ? MeUserSchema.parse(row) : null;
  }

  async getPublicById(
    id: string,
    user_id?: string
  ): Promise<PublicUser | null> {
    const isFollowedExpr = user_id
      ? exists(
          db
            .select()
            .from(followTable)
            .where(
              and(
                eq(followTable.following_id, user.id),
                eq(followTable.follower_id, user_id)
              )
            )
        )
      : sql<boolean>`false`;

    const rows = await db
      .select({
        id: user.id,
        name: user.name,
        image: user.image,
        followersCount: db.$count(
          followTable,
          eq(followTable.following_id, user.id)
        ),
        followingCount: db.$count(
          followTable,
          eq(followTable.follower_id, user.id)
        ),
        isFollowed: isFollowedExpr
      })
      .from(user)
      .where(eq(user.id, id))
      .limit(1);

    const row = rows[0] ?? null;
    return row ? PublicUserSchema.parse(row) : null;
  }

  async getPublicAll(): Promise<PublicUser[]> {
    const rows = await db
      .select({
        id: user.id,
        name: user.name,
        image: user.image,
        followersCount: db.$count(
          followTable,
          eq(followTable.following_id, user.id)
        ),
        followingCount: db.$count(
          followTable,
          eq(followTable.follower_id, user.id)
        ),
        isFollowed: sql<boolean>`false`
      })
      .from(user);

    return PublicUserSchema.array().parse(rows);
  }

  async setImageKey(id: string, imageKey: string | null): Promise<PublicUser> {
    const rows = await db
      .update(user)
      .set({ image: imageKey })
      .where(eq(user.id, id))
      .returning({
        id: user.id,
        name: user.name,
        image: user.image
      });

    const row = rows[0] ?? null;
    if (!row) throw new Error("User not found");
    return PublicUserSchema.parse(row);
  }
}
