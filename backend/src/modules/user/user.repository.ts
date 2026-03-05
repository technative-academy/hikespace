import { db } from "#db/db.js";
import { user } from "#db/schema.js";
import { eq, InferInsertModel, InferSelectModel } from "drizzle-orm";
import {
  PublicUser,
  PublicUserSchema,
  UserRow,
  userSelectSchema
} from "./user.zod.js";

export class UserRepository {
  async getById(id: string): Promise<UserRow | null> {
    const rows = await db.select().from(user).where(eq(user.id, id)).limit(1);
    const row = rows[0] ?? null;
    return row ? userSelectSchema.parse(row) : null;
  }

  async getPublicById(id: string): Promise<PublicUser | null> {
    const rows = await db
      .select({
        id: user.id,
        name: user.name,
        image: user.image
      })
      .from(user)
      .where(eq(user.id, id))
      .limit(1);

    const row = rows[0] ?? null;
    return row ? PublicUserSchema.parse(row) : null;
  }

  async getPublicAll(): Promise<PublicUser[]> {
    const rows = await db
      .select({
        id: user.id,
        name: user.name,
        image: user.image
      })
      .from(user);

    const row = rows[0] ?? null;
    return PublicUserSchema.array().parse(row);
  }

  async setImageKey(id: string, imageKey: string | null): Promise<PublicUser> {
    const rows = await db
      .update(user)
      .set({ image: imageKey })
      .where(eq(user.id, id))
      .returning({
        id: user.id,
        name: user.name,
        image: user.image
      });

    const row = rows[0] ?? null;
    if (!row) throw new Error("User not found");
    return PublicUserSchema.parse(row);
  }
}
