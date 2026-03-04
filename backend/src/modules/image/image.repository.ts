import { db } from "#db/db.js";
import { imageTable } from "#db/schema.js";
import { eq, InferInsertModel, InferSelectModel } from "drizzle-orm";

export type Image = InferSelectModel<typeof imageTable>;
export type NewImage = InferInsertModel<typeof imageTable>;

export class ImageRepository {
  async create(data: NewImage): Promise<Image> {
    const [table] = await db.insert(imageTable).values(data).returning();

    return table;
  }

  async get(id: number): Promise<Image | null> {
    const image = await db.query.imageTable.findFirst({
      where: eq(imageTable.id, id)
    });

    return image ?? null;
  }

  async update(id: number, url: string): Promise<Image | null> {
    const [image] = await db
      .update(imageTable)
      .set({ image_url: url })
      .where(eq(imageTable.id, id))
      .returning();
    return image;
  }

  async delete(id: number): Promise<void> {
    await db.delete(imageTable).where(eq(imageTable.id, id));
  }
}
