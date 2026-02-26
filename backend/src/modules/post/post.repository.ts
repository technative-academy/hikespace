import { db } from "#db/db.js";
import { postTable } from "#db/schema.js";
import { eq, InferInsertModel, InferSelectModel } from "drizzle-orm";

export type Post = InferSelectModel<typeof postTable>;
export type NewPost = InferInsertModel<typeof postTable>;

export class PostRepository {
  async create(data: NewPost): Promise<Post> {
    const [table] = await db.insert(postTable).values(data).returning();

    return table;
  }

  async get(id: number): Promise<Post | null> {
    const post = await db.query.postTable.findFirst({
      where: eq(postTable.id, id)
    });

    return post ?? null;
  }
}
