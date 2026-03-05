import type { Request, Response } from "express";
import type { UserService } from "./user.service.js";
import {
  CreateUserSchema,
  PublicUserSchema,
  UpdateUserSchema
} from "./user.zod.js";
import { IdParamSchema } from "#utils/validators.js";

export class UserController {
  constructor(private readonly userService: UserService) {}

  // POST /users
  create = async (req: Request, res: Response) => {
    const validated = CreateUserSchema.safeParse(req.body);

    if (!validated.success) {
      return res.status(400).json({
        message: "Invalid request body",
        errors: validated.error.flatten()
      });
    }

    try {
      const user = await this.userService.create(validated.data);

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

  getAll = async (_req: Request, res: Response) => {
    const allUsers = await this.userService.getAll();

    return res.status(200).json(allUsers);
  };

  // PUT /users/:id
  update = async (req: Request, res: Response) => {
    const validatedParams = IdParamSchema.safeParse(req.params);

    if (!validatedParams.success) {
      return res.status(400).json({
        message: "Invalid id parameter",
        errors: validatedParams.error.flatten()
      });
    }

    const parsedBody = {
      username: req.body.username,
      email: req.body.email
    };

    const validatedBody = UpdateUserSchema.safeParse(parsedBody);

    if (!validatedBody.success) {
      return res.status(400).json({
        message: "Invalid request body",
        errors: validatedBody.error.flatten()
      });
    }

    if (Object.keys(validatedBody.data).length === 0) {
      return res.status(400).json({
        message: "No updatable fields provided"
      });
    }

    try {
      const user = await this.userService.update(
        validatedParams.data.id,
        validatedBody.data,
        req.file
      );

      if (!user) {
        return res.status(404).json({
          message: "User not found"
        });
      }

      return res.status(200).json(PublicUserSchema.parse(user));
    } catch (error) {
      return res.status(500).json({
        message: "Failed to update user"
      });
    }
  };

  // DELETE /users/:id
  delete = async (req: Request, res: Response) => {
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

    try {
      await this.userService.delete(parsedParams.data.id);

      return res.status(200).json({ status: "OK" });
    } catch (error) {
      return res.status(500).json({
        message: "Failed to delete user"
      });
    }
  };
}
