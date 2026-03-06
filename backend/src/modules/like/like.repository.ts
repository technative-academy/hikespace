import { db } from "#db/db.js";
import { likeTable } from "#db/schema.js";
import { and, eq, InferInsertModel, InferSelectModel } from "drizzle-orm";

export type Like = InferSelectModel<typeof likeTable>;
export type NewLike = InferInsertModel<typeof likeTable>;

export class LikeRepository {
  async create(data: NewLike): Promise<Like> {
    const [like] = await db.insert(likeTable).values(data).returning();

    return like;
  }

  async delete(id: number, userId: string): Promise<boolean> {
    const deleted = await db
      .delete(likeTable)
      .where(and(eq(likeTable.id, id), eq(likeTable.user_id, userId)))
      .returning({ id: likeTable.id });

    return deleted.length > 0;
  }
}
