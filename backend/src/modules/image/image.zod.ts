import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { imageTable } from "../../db/schema.js";

export const ImageSchema = createSelectSchema(imageTable);

export const uploadImageMetadataSchema = z.object({
  post_id: z.number().int(),
  metadata: z.array(
    z.object({
      position: z.number().int()
    })
  )
});

export type Image = z.infer<typeof ImageSchema>;
export type CreateImageMetadataDto = z.infer<typeof uploadImageMetadataSchema>;
