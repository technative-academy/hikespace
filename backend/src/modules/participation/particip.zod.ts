import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { participTable } from "../../db/schema.js";

export const participSchema = createSelectSchema(participTable);

export const createParticipSchema = createInsertSchema(participTable).omit({
  id: true
});

export type Particip = z.infer<typeof participSchema>;
export type CreateParticipDto = z.infer<typeof createParticipSchema>;
