import { db } from "#db/db.js";
import { postTable } from "#db/schema.js";
import { eq, InferInsertModel, InferSelectModel, sql } from "drizzle-orm";

type LineStringGeoJSON = {
  type: "LineString";
  coordinates: [number, number][];
};

export type Post = Omit<InferSelectModel<typeof postTable>, "route"> & {
  route: LineStringGeoJSON;
};
export type NewPost = InferInsertModel<typeof postTable>;

export class PostRepository {
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
    const [post] = await db
      .select({
        id: postTable.id,
        owner_id: postTable.owner_id,
        description: postTable.description,
        route: sql<LineStringGeoJSON>`ST_AsGeoJSON(${postTable.route})::json`,
        location_name: postTable.location_name,
        caption: postTable.caption
      })
      .from(postTable)
      .where(eq(postTable.id, id))
      .limit(1);

    if (!post) {
      return null;
    }

    return post as Post;
  }

  async getAll(): Promise<Post[]> {
    const allPosts: Post[] = await db
      .select({
        id: postTable.id,
        owner_id: postTable.owner_id,
        description: postTable.description,
        route: sql<LineStringGeoJSON>`ST_AsGeoJSON(${postTable.route})::json`,
        location_name: postTable.location_name,
        caption: postTable.caption
      })
      .from(postTable);

    return allPosts;
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
