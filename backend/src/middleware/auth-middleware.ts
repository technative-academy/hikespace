import { auth } from "#utils/auth.js";
import { fromNodeHeaders } from "better-auth/node";
import type { Request, Response, NextFunction } from "express";

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
}
