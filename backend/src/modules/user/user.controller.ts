import type { Request, Response } from "express";
import type { UserService } from "./user.service.js";
import { CreateUserSchema, PublicUserSchema } from "./user.zod.js";
import { IdParamSchema } from "#utils/validators.js";

export class UserController {
  constructor(private readonly userService: UserService) {}

  // POST /users
  create = async (req: Request, res: Response) => {
    const parsedBody = CreateUserSchema.safeParse(req.body);

    if (!parsedBody.success) {
      return res.status(400).json({
        message: "Invalid request body",
        errors: parsedBody.error.flatten()
      });
    }

    try {
      const user = await this.userService.create(parsedBody.data);

      return res.status(201).json(PublicUserSchema.parse(user));
    } catch (error) {
      return res.status(500).json({
        message: "Failed to create user"
      });
    }
  };

  // GET /users/:id
  get = async (req: Request, res: Response) => {
    const parsedParams = IdParamSchema.safeParse(req.params);

    if (!parsedParams.success) {
      return res.status(400).json({
        message: "Invalid id parameter",
        errors: parsedParams.error.flatten()
      });
    }

    const user = await this.userService.get(parsedParams.data.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    return res.status(200).json(PublicUserSchema.parse(user));
  };
}
