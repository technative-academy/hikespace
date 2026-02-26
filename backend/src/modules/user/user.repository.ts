import { db } from "#db/db.js";
import { userTable } from "#db/schema.js";
import { eq, InferInsertModel, InferSelectModel } from "drizzle-orm";

export type User = InferSelectModel<typeof userTable>;
export type NewUser = InferInsertModel<typeof userTable>;

export class UserRepository {
  async create(data: NewUser): Promise<User> {
    const [user] = await db.insert(userTable).values(data).returning();

    return user;
  }

  async get(id: number): Promise<User | null> {
    const user = await db.query.userTable.findFirst({
      where: eq(userTable.id, id)
    });

    return user ?? null;
  }

  async updateUsername(id: number, username: string): Promise<User | null> {
    const [user] = await db
      .update(userTable)
      .set({ username: username })
      .where(eq(userTable.id, id))
      .returning();
    return user;
  }

  async delete(id: number): Promise<void> {
    await db.delete(userTable).where(eq(userTable.id, id));
  }
}
