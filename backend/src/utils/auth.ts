import { db } from "#db/db.js";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { betterAuth } from "better-auth";
import * as schema from "#db/schema.js";

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true
  },
  database: drizzleAdapter(db, {
    provider: "pg",
    schema
  }),
  user: {
    deleteUser: { enabled: true }
  }
});
