import type { Request, Response } from "express";
import type { UserService } from "./user.service.js";
import { z } from "zod";
import { auth } from "#utils/auth.js";
import { fromNodeHeaders } from "better-auth/node";
import { IdParamSchema, IdStringParamSchema } from "#utils/validators.js";

export class UserController {
  constructor(private readonly userService: UserService) {}

  // GET /users/me
  getMe = async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized"
      });
    }

    const user = await this.userService.getMe(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    return res.status(200).json(user);
  };

  // GET /users/:id
  getById = async (req: Request, res: Response) => {
    const parsedParams = IdStringParamSchema.safeParse(req.params);

    if (!parsedParams.success) {
      return res.status(400).json({
        message: "Invalid id parameter",
        errors: parsedParams.error.flatten()
      });
    }
    try {
      const user = await this.userService.get(parsedParams.data.id);

      if (!user) {
        return res.status(404).json({
          message: "User not found"
        });
      }

      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({
        message: "Failed to get user",
        error
      });
    }
  };

  getAll = async (_req: Request, res: Response) => {
    try {
      const allUsers = await this.userService.getAll();

      return res.status(200).json(allUsers);
    } catch (error) {
      return res.status(500).json({
        message: "Failed to get users",
        error
      });
    }
  };

  // PUT /users/avatar
  updateImage = async (req: Request, res: Response) => {
    try {
      await this.userService.updateImage(req.user.id, req.file);

      return res.status(200).json({ message: "OK" });
    } catch (error) {
      return res.status(500).json({
        message: "Failed to update user",
        error
      });
    }
  };

  // DELETE /users
  delete = async (req: Request, res: Response) => {
    try {
      await this.userService.prepareAccountDeletion(req.user.id);

      await auth.api.deleteUser({
        body: {},
        headers: fromNodeHeaders(req.headers)
      });

      return res.status(200).json({ status: "OK" });
    } catch (error) {
      return res.status(500).json({
        message: "Failed to delete user",
        error
      });
    }
  };
}
