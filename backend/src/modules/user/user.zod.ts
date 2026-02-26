import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { userTable } from "../../db/schema.js";

export const UserSchema = createSelectSchema(userTable);

export const PublicUserSchema = UserSchema.omit({
  password_hash: true
});

export const CreateUserSchema = createInsertSchema(userTable)
  .omit({ id: true, password_hash: true })
  .extend({
    password: z.string().min(8).max(20)
  });

export const UpdateUserSchema = UserSchema.omit({
  id: true,
  password_hash: true,
  image_url: true,
  email: true
})
  .partial()
  .strict();

export type User = z.infer<typeof UserSchema>;
export type CreateUserDto = z.infer<typeof CreateUserSchema>;
export type UpdateUserDto = z.infer<typeof UpdateUserSchema>;
