import { db } from "#db/db.js";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { betterAuth } from "better-auth";
import * as schema from "#db/schema.js";
import { logger } from "#config/logger.js";

const isDev = process.env.NODE_ENV !== "production";

export const auth = betterAuth({
  trustedOrigins: [
    process.env.SWAGGER_URL!,
    "https://hikespace-*-j0lols-projects.vercel.app",
  ],
  emailAndPassword: {
    enabled: true
  },
  database: drizzleAdapter(db, {
    provider: "pg",
    schema
  }),
  user: {
    deleteUser: { enabled: true }
  },
  logger: {
    level: isDev ? "debug" : "info",
    log: (level, message, ...args) => {
      logger[level](message, ...args);
    }
  }
});
