import type { Request, Response } from "express";
import type { LikeService } from "./like.service.js";
import { IdParamSchema } from "#utils/validators.js";

export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  create = async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const parsed = IdParamSchema.safeParse(req.params);

    if (!parsed.success) {
      return res
        .status(400)
        .json({ message: "Invalid request params", errors: parsed.error });
    }

    try {
      const like = await this.likeService.create(
        { post_id: parsed.data.id },
        req.user.id
      );

      if (!like) {
        return res.status(404).json({ message: "User or post not found!" });
      }

      return res.status(201).json(like);
    } catch (error) {
      return res.status(500).json({ message: "Failed to create like" });
    }
  };

  delete = async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const parsed = IdParamSchema.safeParse(req.params);

    if (!parsed.success) {
      return res
        .status(400)
        .json({ message: "Invalid request params", errors: parsed.error });
    }

    try {
      const deleted = await this.likeService.delete(parsed.data.id, req.user.id);

      if (!deleted) {
        return res.status(404).json({ message: "Like not found" });
      }

      return res.status(200).json({ message: "OK" });
    } catch (error) {
      return res.status(500).json({ message: "Failed to delete like" });
    }
  };
}
