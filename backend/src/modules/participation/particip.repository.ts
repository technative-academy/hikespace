import { db } from "#db/db.js";
import { participTable } from "#db/schema.js";
import { eq, InferInsertModel, InferSelectModel } from "drizzle-orm";

export type Particip = InferSelectModel<typeof participTable>;
export type NewParticip = InferInsertModel<typeof participTable>;

export class ParticipRepository {
  async create(data: NewParticip): Promise<Particip> {
    const [particip] = await db.insert(participTable).values(data).returning();

    return particip;
  }

  async createMany(postId: number, userIds: string[]): Promise<Particip[]> {
    const particip = await db
      .insert(participTable)
      .values(
        userIds.map((userId) => ({
          post_id: postId,
          user_id: userId
        }))
      )
      .returning();

    return particip;
  }

  async delete(id: number): Promise<void> {
    await db.delete(participTable).where(eq(participTable.id, id));
  }
}
