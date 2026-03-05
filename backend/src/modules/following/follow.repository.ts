import { db } from "#db/db.js";
import { followTable } from "#db/schema.js";
import { eq, InferInsertModel, InferSelectModel } from "drizzle-orm";

export type Follow = InferSelectModel<typeof followTable>;
export type NewFollow = InferInsertModel<typeof followTable>;

export class FollowRepository {
  async create(data: NewFollow): Promise<Follow> {
    const [like] = await db.insert(followTable).values(data).returning();

    return like;
  }

  async delete(id: number): Promise<void> {
    await db.delete(followTable).where(eq(followTable.id, id));
  }
}
