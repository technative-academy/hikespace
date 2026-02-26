import type { Request, Response, NextFunction } from "express";

const DEFAULT_USER = {
  id: 1,
  email: "mock.user@example.com",
  name: "Mock User"
};

export function mockAuth(_req: Request, _res: Response, next: NextFunction) {
  _req.user = DEFAULT_USER;
  next();
}
