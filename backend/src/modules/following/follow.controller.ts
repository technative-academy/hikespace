import type { Request, Response } from "express";
import type { FollowService } from "./follow.service.js";
import { createFollowSchema } from "./follow.zod.js";
import { IdParamSchema } from "#utils/validators.js";

export class FollowController {
  constructor(private readonly followService: FollowService) {}

  create = async (req: Request, res: Response) => {
    const parsed = createFollowSchema.safeParse(req.params);

    if (!parsed.success) {
      return res
        .status(400)
        .json({ message: "Invalid request params", errors: parsed.error });
    }

    try {
      const follow = await this.followService.create(parsed.data);

      if (!follow) {
        return res.status(404).json({ message: "Follower ID not found!" });
      }

      return res.status(201).json(follow);
    } catch (error) {
      return res.status(500).json({ message: "Failed to create follow" });
    }
  };

  delete = async (req: Request, res: Response) => {
    const parsed = IdParamSchema.safeParse(req.params);

    if (!parsed.success) {
      return res
        .status(400)
        .json({ message: "Invalid request params", errors: parsed.error });
    }

    try {
      await this.followService.delete(parsed.data.id);
      return res.status(200).json({ message: "OK" });
    } catch (error) {
      return res.status(500).json({ message: "Failed to delete follow" });
    }
  };
}
