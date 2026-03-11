import type { Request, Response } from "express";
import type { ParticipService } from "./particip.service.js";
import {
  createManyParticipSchema,
  createParticipSchema
} from "./particip.zod.js";
import { IdParamSchema } from "#utils/validators.js";

export class ParticipController {
  constructor(private readonly participService: ParticipService) {}

  create = async (req: Request, res: Response) => {
    const parsed = createParticipSchema.safeParse(req.body);

    if (!parsed.success) {
      return res
        .status(400)
        .json({ message: "Invalid request params", errors: parsed.error });
    }

    try {
      const particip = await this.participService.create(
        parsed.data,
        req.user.id
      );

      if (!particip) {
        return res.status(403).json({ message: "User is not an owner" });
      }

      return res.status(201).json(particip);
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Failed to create participation" });
    }
  };

  createMany = async (req: Request, res: Response) => {
    const parsed = createManyParticipSchema.safeParse(req.body);

    if (!parsed.success) {
      return res
        .status(400)
        .json({ message: "Invalid request params", errors: parsed.error });
    }

    try {
      const particip = await this.participService.createMany(
        parsed.data,
        req.user.id
      );

      if (!particip) {
        return res.status(403).json({ message: "User is not an owner" });
      }

      return res.status(201).json(particip);
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Failed to create participation" });
    }
  };

  delete = async (req: Request, res: Response) => {
    const parsed = IdParamSchema.safeParse(req.params);

    if (!parsed.success) {
      return res
        .status(400)
        .json({ message: "Invalid id parameter", errors: parsed.error });
    }

    try {
      await this.participService.delete(parsed.data.id, req.user.id);
      return res.status(200).json({ message: "OK" });
    } catch (error) {
      return res.status(500).json({ message: "Error deleting participation" });
    }
  };
}
