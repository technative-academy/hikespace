import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { userTable } from "../db/schema.js";

// What your API returns for a user (SELECT shape)
export const UserSchema = createSelectSchema(userTable, {
  // optional overrides if you want:
  // createdAt: z.string().datetime()  // if you serialize dates as ISO strings
});

// What your API accepts to create a user (INSERT shape)
export const CreateUserSchema = createInsertSchema(userTable, {
  // id is auto-generated; createdAt defaults; you can omit them:
}).omit({ id: true });

// Often you also want an “update” schema:
export const UpdateUserSchema = CreateUserSchema.partial();

// Helpful types
export type User = z.infer<typeof UserSchema>;
export type CreateUserDto = z.infer<typeof CreateUserSchema>;
