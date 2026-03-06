import { auth } from "#utils/auth.js";
import { fromNodeHeaders } from "better-auth/node";
import type { Request, Response, NextFunction } from "express";

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers)
    });

    if (!session?.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = {
      id: session.user.id,
      email: session.user.email ?? null,
      name: session.user.name ?? null,
      image: session.user.image ?? null
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
}
