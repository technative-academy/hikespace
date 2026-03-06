import { IdStringParamSchema } from "./../../utils/validators.js";
import type { Request, Response } from "express";
import type { FollowService } from "./follow.service.js";
import { createFollowSchema } from "./follow.zod.js";
import { IdParamSchema } from "#utils/validators.js";

export class FollowController {
  constructor(private readonly followService: FollowService) {}

  create = async (req: Request, res: Response) => {
    const validatedParams = IdStringParamSchema.safeParse(req.params);

    if (!validatedParams.success) {
      return res.status(400).json({
        message: "Invalid request params",
        errors: validatedParams.error
      });
    }

    try {
      const follow = await this.followService.create({
        follower_id: req.user.id,
        following_id: validatedParams.data.id
      });

      if (!follow) {
        return res.status(404).json({ message: "Following ID not found!" });
      }

      return res.status(201).json(follow);
    } catch (error) {
      return res.status(500).json({ message: "Failed to create follow" });
    }
  };

  delete = async (req: Request, res: Response) => {
    const validatedParams = IdStringParamSchema.safeParse(req.params);

    if (!validatedParams.success) {
      return res.status(400).json({
        message: "Invalid request params",
        errors: validatedParams.error
      });
    }

    try {
      await this.followService.delete(req.user.id, validatedParams.data.id);
      return res.status(200).json({ message: "OK" });
    } catch (error) {
      return res.status(500).json({ message: "Failed to delete follow" });
    }
  };
}
