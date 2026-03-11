import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { participTable } from "../../db/schema.js";

export const participSchema = createSelectSchema(participTable);

export const createParticipSchema = createInsertSchema(participTable).omit({
  id: true
});

export const createManyParticipSchema = z.object({
  userIds: z.array(z.string()).min(1),
  postId: z.int()
});

export type Particip = z.infer<typeof participSchema>;
export type CreateParticipDto = z.infer<typeof createParticipSchema>;
export type CreateManyParticipDto = z.infer<typeof createManyParticipSchema>;
