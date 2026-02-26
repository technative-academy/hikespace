import { z } from "zod";

export const IdParamSchema = z.object({
  id: z.coerce.number().int().positive()
});

export const IdStringParamSchema = z.object({
  id: z.coerce.number().int().positive(),
  username: z.coerce.string()
});

export type IdParam = z.infer<typeof IdParamSchema>;

export type IdStringParam = z.infer<typeof IdStringParamSchema>;
