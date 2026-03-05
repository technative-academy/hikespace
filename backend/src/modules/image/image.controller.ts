import type { Request, Response } from "express";
import type { ImageService } from "./image.service.js";
import { uploadImageMetadataSchema, ImageSchema } from "./image.zod.js";
import { IdParamSchema } from "#utils/validators.js";

export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  create = async (req: Request, res: Response) => {
    const files = req.files as Express.Multer.File[];
    const parsedBody = {
      post_id: Number(req.body.post_id),
      metadata: JSON.parse(req.body.metadata)
    };
    const validated = uploadImageMetadataSchema.safeParse(parsedBody);

    if (!validated.success) {
      return res.status(400).json({
        message: "Invalid request body",
        errors: validated.error
      });
    }

    // TODO: add BackBlaze to host images saved to database

    try {
      const image = await this.imageService.create(validated.data, files);

      if (!image) {
        return res.status(404).json({ message: "Post not found" });
      }

      return res.status(201).json(ImageSchema.array().parse(image));
    } catch (error) {
      return res.status(500).json({
        message: "Failed to save image"
      });
    }
  };

  get = async (req: Request, res: Response) => {
    const parsedBody = IdParamSchema.safeParse(req.params);

    if (!parsedBody.success) {
      return res.status(400).json({
        message: "Invalid request body",
        errors: parsedBody.error
      });
    }

    try {
      const getImage = await this.imageService.get(parsedBody.data.id);

      return res.status(200).json(ImageSchema.parse(getImage));
    } catch (error) {
      return res.status(500).json({ message: "Failed to get image", error });
    }
  };

  delete = async (req: Request, res: Response) => {
    const parsedBody = IdParamSchema.safeParse(req.params);

    if (!parsedBody.success) {
      return res.status(400).json({
        message: "Invalid request body",
        errors: parsedBody.error
      });
    }

    try {
      await this.imageService.delete(parsedBody.data.id);
      return res.status(200).json({ message: "OK" });
    } catch (error) {
      return res.status(500).json({ message: "Error deleting file" });
    }
  };
}
