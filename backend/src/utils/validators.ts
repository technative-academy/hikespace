import { z } from "zod";

export const IdParamSchema = z.object({
  id: z.coerce.number().int().positive()
});

export const IdStringParamSchema = z.object({
  id: z.coerce.string().min(1)
});

export type IdParam = z.infer<typeof IdParamSchema>;
