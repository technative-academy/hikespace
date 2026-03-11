import type { ImageRepository } from "./image.repository.js";
import type { Image, CreateImageMetadataDto } from "./image.zod.js";
import { ImageHandler } from "#utils/image-handler.js";
import { s3 } from "../../config/s3.js";
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PostService } from "#modules/post/post.service.js";
import { PostRepository } from "#modules/post/post.repository.js";

export class ImageService {
  constructor(private readonly images: ImageRepository) { }

  imageHandler = new ImageHandler();

  postService = new PostService(new PostRepository());

  async create(
    dto: CreateImageMetadataDto,
    images: Express.Multer.File[]
  ): Promise<Image[] | null> {
    const postCheck = await this.postService.get(dto.post_id);

    if (!postCheck) {
      return null;
    }

    let result: Image[] = await Promise.all(
      images.map(async (image, idx) => {
        let imageKey = new Date().getTime().toString() + image.originalname;

        await this.imageHandler.put(image.buffer, image.mimetype, imageKey);

        const toAdd = await this.images.create({
          post_id: dto.post_id,
          image_url: imageKey,
          position: dto.metadata[idx].position
        });

        return toAdd;
      })
    );
    return result;
  }

  async get(id: number): Promise<Image | null> {
    let getImage: Image | null = await this.images.get(id);

    if (!getImage) {
      return null;
    }

    getImage.image_url = await this.imageHandler.get(getImage.image_url);

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

    await this.imageHandler.delete(getImage.image_url);

    this.images.delete(id);
  }
}
