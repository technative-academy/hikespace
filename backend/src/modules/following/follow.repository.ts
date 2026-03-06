import { db } from "#db/db.js";
import { followTable } from "#db/schema.js";
import { and, eq, InferInsertModel, InferSelectModel } from "drizzle-orm";

export type Follow = InferSelectModel<typeof followTable>;
export type NewFollow = InferInsertModel<typeof followTable>;

export class FollowRepository {
  async create(data: NewFollow): Promise<Follow> {
    const [like] = await db.insert(followTable).values(data).returning();

    return like;
  }

  async delete(currentUserId: string, targetUserId: string): Promise<void> {
    await db
      .delete(followTable)
      .where(
        and(
          eq(followTable.follower_id, currentUserId),
          eq(followTable.following_id, targetUserId)
        )
      );
  }
}
