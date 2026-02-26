import type { Request, Response } from "express";
import type { ImageService } from "./image.service.js";
import { CreateImageSchema, ImageSchema } from "./image.zod.js";

export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  create = async (req: Request, res: Response) => {
    const parsedBody = CreateImageSchema.safeParse(req.body);

    if (!parsedBody.success) {
      return res.status(400).json({
        message: "Invalid request body",
        errors: parsedBody.error.flatten()
      });
    }

    // TODO: add BackBlaze to host images saved to database

    try {
      const image = await this.imageService.create(parsedBody.data);

      return res.status(201).json(ImageSchema.parse(image));
    } catch (error) {
      return res.status(500).json({
        message: "Failed to save image"
      });
    }
  };

  get = async (req: Request, res: Response) => {};

  update = async (req: Request, res: Response) => {};

  delete = async (req: Request, res: Response) => {};
}
