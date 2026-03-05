import type { Request, Response } from "express";
import type { UserService } from "./user.service.js";

export class UserController {
  constructor(private readonly userService: UserService) {}

  // GET /users/me
  get = async (req: Request, res: Response) => {
    const user = await this.userService.getMe(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    return res.status(200).json(user);
  };

  // // GET /users/:id
  // get = async (req: Request, res: Response) => {
  //   const parsedParams = IdParamSchema.safeParse(req.params);

  //   if (!parsedParams.success) {
  //     return res.status(400).json({
  //       message: "Invalid id parameter",
  //       errors: parsedParams.error.flatten()
  //     });
  //   }

  //   const user = await this.userService.get(parsedParams.data.id);

  //   if (!user) {
  //     return res.status(404).json({
  //       message: "User not found"
  //     });
  //   }

  //   return res.status(200).json(PublicUserSchema.parse(user));
  // };

  getAll = async (_req: Request, res: Response) => {
    const allUsers = await this.userService.getAll();

    return res.status(200).json(allUsers);
  };

  // PUT /users/:id
  updateImage = async (req: Request, res: Response) => {
    try {
      await this.userService.updateImage(req.user.id, req.file);

      return res.status(200).json({ message: "OK" });
    } catch (error) {
      return res.status(500).json({
        message: "Failed to update user"
      });
    }
  };

  // // DELETE /users/:id
  // delete = async (req: Request, res: Response) => {
  //   const user = req.user;

  //   if (!user) {
  //     return res.status(404).json({
  //       message: "User not found"
  //     });
  //   }

  //   try {
  //     await this.userService.prepareAccountDeletion(user.id);

  //     const result = await auth.api.deleteUser({
  //       headers: fromNodeHeaders(req.headers)
  //     });

  //     return res.status(200).json({ status: "OK" });
  //   } catch (error) {
  //     return res.status(500).json({
  //       message: "Failed to delete user"
  //     });
  //   }
  // };
}
