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

  async getAll(): Promise<User[]> {
    const allUsers = await db.select().from(userTable);

    return allUsers;
  }

  async update(
    id: number,
    data: Partial<Omit<User, "id" | "password_hash">>
  ): Promise<User | null> {
    const [user] = await db
      .update(userTable)
      .set(data)
      .where(eq(userTable.id, id))
      .returning();
    return user ?? null;
  }

  async delete(id: number): Promise<void> {
    await db.delete(userTable).where(eq(userTable.id, id));
  }
}
