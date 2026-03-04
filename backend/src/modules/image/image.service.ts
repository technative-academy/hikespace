import type { ImageRepository } from "./image.repository.js";
import type { Image, CreateImageMetadataDto } from "./image.zod.js";
import { s3 } from "../../config/s3.js";
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export class ImageService {
  constructor(private readonly images: ImageRepository) {}

  async create(
    dto: CreateImageMetadataDto,
    images: Express.Multer.File[]
  ): Promise<Image[]> {
    let result: Image[] = [];
    images.forEach(async (image, idx) => {
      let imageKey = new Date().getTime().toString() + image.filename;

      await s3.send(
        new PutObjectCommand({
          Bucket: process.env.BACK_BLAZE_BUCKET_NAME!,
          Body: image.buffer,
          ContentType: image.mimetype,
          Key: imageKey
        })
      );

      const toAdd = await this.images.create({
        post_id: dto.post_id,
        image_url: imageKey,
        position: dto.metadata[idx].position
      });

      result.push(toAdd);
    });
    return result;
  }

  async get(id: number): Promise<Image | null> {
    let getImage: Image | null = await this.images.get(id);

    if (!getImage) {
      return null;
    }

    const getCommand = new GetObjectCommand({
      Bucket: process.env.BACK_BLAZE_BUCKET_NAME!,
      Key: getImage.image_url
    });

    const backblazeUrl = await getSignedUrl(s3, getCommand, {
      expiresIn: 3600
    });

    getImage.image_url = backblazeUrl;

    return getImage;
  }

  async update(id: number, url: string): Promise<Image | null> {
    return this.images.update(id, url);
  }

  async delete(id: number): Promise<void | null> {
    let getImage: Image | null = await this.images.get(id);

    if (!getImage) {
      return null;
    }

    await s3.send(
      new DeleteObjectCommand({
        Bucket: process.env.BACK_BLAZE_BUCKET_NAME!,
        Key: getImage.image_url
      })
    );

    this.images.delete(id);
  }
}
