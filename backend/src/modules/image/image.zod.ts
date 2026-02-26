import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { imageTable } from "../../db/schema.js";

export const ImageSchema = createSelectSchema(imageTable);

export const CreateImageSchema = createInsertSchema(imageTable);

export type Image = z.infer<typeof ImageSchema>;
export type CreateImageDto = z.infer<typeof CreateImageSchema>;
