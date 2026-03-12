import { db } from "#db/db.js";
import { likeTable, postTable, user } from "#db/schema.js";
import { eq, InferInsertModel, sql } from "drizzle-orm";
import { Post, PopulatedPost } from "./post.zod.js";
import { UserRepository } from "#modules/user/user.repository.js";

type LineStringGeoJSON = {
  type: "LineString";
  coordinates: [number, number][];
};

export type NewPost = InferInsertModel<typeof postTable>;

export class PostRepository {
  userRepository = new UserRepository();

  async create(data: NewPost): Promise<Post> {
    const geojson = JSON.stringify(data.route);
    const result = await db.execute(sql<Post>`
      INSERT INTO "post" ("owner_id", "description", "path", "location_name", "caption")
      VALUES (
        ${data.owner_id},
        ${data.description},
        ST_SetSRID(ST_GeomFromGeoJSON(${geojson}), 4326),
        ${data.location_name},
        ${data.caption}
      )
      RETURNING
        "id",
        "owner_id",
        "description",
        ST_AsGeoJSON("path")::json AS "route",
        "location_name",
        "caption"
    `);

    const row = result.rows[0];
    if (!row) {
      throw new Error("Failed to create post");
    }

    return row as Post;
  }

  async get(id: number): Promise<Post | null> {
    const post = await db.query.postTable.findFirst({
      where: eq(postTable.id, id),
      columns: {
        route: false
      },
      extras: {
        route:
          sql<LineStringGeoJSON>`ST_AsGeoJSON(${postTable.route})::json`.as(
            "route"
          )
      }
    });

    if (!post) {
      return null;
    }

    return post;
  }

  async getPopulated(
    id: number,
    userId: string
  ): Promise<PopulatedPost | null> {
    const post = await db.query.postTable.findFirst({
      where: eq(postTable.id, id),
      columns: {
        route: false
      },
      extras: {
        route:
          sql<LineStringGeoJSON>`ST_AsGeoJSON(${postTable.route})::json`.as(
            "route"
          ),
        likes: sql<number>`
                (
                  select CAST(count(*) AS int)
                  from ${likeTable}
                  where "like"."post_id" = ${postTable.id}
                )
              `.as("likes"),
        like_id: sql<number | null>`
      (
        select "like"."id"
        from ${likeTable}
        where ${likeTable}."post_id" = "postTable"."id"
        and ${likeTable}."user_id" = ${userId}
        limit 1
      )
    `.as("like_id")
      },
      with: {
        images: true,
        particips: {
          columns: {},
          with: {
            user: {
              columns: {
                id: true,
                name: true,
                image: true
              }
            }
          }
        }
      }
    });

    if (!post) {
      return null;
    }

    return {
      ...post,
      participations: post.particips.map((p) => ({
        id: p.user.id,
        name: p.user.name,
        image: p.user.image
      }))
    };
  }

  async getAll(): Promise<PopulatedPost[]> {
    const posts = await db.query.postTable.findMany({
      columns: {
        route: false
      },
      extras: {
        route:
          sql<LineStringGeoJSON>`ST_AsGeoJSON(${postTable.route})::json`.as(
            "route"
          ),
        likes: sql<number>`
                (
                  select CAST(count(*) AS int)
                  from ${likeTable}
                  where "like"."post_id" = ${postTable.id}
                )
              `.as("likes")
      },
      with: {
        images: true,
        particips: {
          columns: {},
          with: {
            user: {
              columns: {
                id: true,
                name: true,
                image: true
              }
            }
          }
        }
      }
    });

    if (!posts) {
      return [];
    }

    return posts.map((post) => ({
      ...post,
      like_id: null,
      participations: post.particips.map((p) => ({
        id: p.user.id,
        name: p.user.name,
        image: p.user.image
      }))
    }));
  }

  async getFromFollowing(id: string): Promise<PopulatedPost[]> {
    let currentUser = await this.userRepository.getById(id);
    if (!currentUser) return [];

    const result = await Promise.all(
      currentUser.followings.map(async (followed) => {
        const posts = await db
          .select()
          .from(postTable)
          .where(eq(postTable.owner_id, followed.followed.id));

        return Promise.all(posts.map((post) => this.getPopulated(post.id, id)));
      })
    );

    return result.flat().filter((p): p is PopulatedPost => p !== null);
  }

  async getByUser(user_id: string): Promise<PopulatedPost[] | null> {
    let currentUser = await this.userRepository.getById(user_id);

    if (!currentUser) {
      return null;
    }

    const result = await Promise.all(
      currentUser.posts.map((post) => this.getPopulated(post.id, user_id))
    );

    return result.flat().filter((p): p is PopulatedPost => p !== null);
  }

  async likedByUser(user_id: string): Promise<PopulatedPost[] | null> {
    let currentUser = await this.userRepository.getById(user_id);

    if (!currentUser) {
      return null;
    }

    const result = await Promise.all(
      currentUser.likes.map(async (like) => {
        const postIds = await db
          .select({ post_id: postTable.id })
          .from(postTable)
          .innerJoin(user, eq(user.id, postTable.owner_id))
          .innerJoin(likeTable, eq(likeTable.post_id, postTable.id))
          .where(eq(likeTable.id, like.id));

        return Promise.all(
          postIds.map((post) => this.getPopulated(post.post_id, user_id))
        );
      })
    );

    return result.flat().filter((p): p is PopulatedPost => p !== null);
  }

  async delete(id: number): Promise<void> {
    await db.delete(postTable).where(eq(postTable.id, id));
  }

  async update(
    id: number,
    data: Partial<Omit<NewPost, "id" | "owner_id">>
  ): Promise<Post | null> {
    const set: Record<string, any> = {};

    if (data.description !== undefined) set.description = data.description;
    if (data.caption !== undefined) set.caption = data.caption;
    if (data.location_name !== undefined)
      set.location_name = data.location_name;

    if (data.route !== undefined) {
      set.route = sql`ST_SetSRID(ST_GeomFromGeoJSON(${JSON.stringify(data.route)}), 4326)`;
    }

    const [updated] = await db
      .update(postTable)
      .set(set)
      .where(eq(postTable.id, id))
      .returning({
        id: postTable.id,
        owner_id: postTable.owner_id,
        description: postTable.description,
        route: sql`ST_AsGeoJSON(${postTable.route})::json`,
        location_name: postTable.location_name,
        caption: postTable.caption
      });

    return updated as Post;
  }
}
