import { db } from "#db/db.js";
import { likeTable } from "#db/schema.js";
import { eq, InferInsertModel, InferSelectModel } from "drizzle-orm";

export type Like = InferSelectModel<typeof likeTable>;
export type NewLike = InferInsertModel<typeof likeTable>;

export class LikeRepository {
  async create(data: NewLike): Promise<Like> {
    const [like] = await db.insert(likeTable).values(data).returning();

    return like;
  }

  async delete(id: number): Promise<void> {
    await db.delete(likeTable).where(eq(likeTable.id, id));
  }
}
