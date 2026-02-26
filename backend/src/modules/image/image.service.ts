import type { ImageRepository } from "./image.repository.js";
import type { Image, CreateImageDto } from "./image.zod.js";

export class ImageService {
  constructor(private readonly images: ImageRepository) {}

  async create(dto: CreateImageDto) {
    return this.images.create({
      post_id: dto.post_id,
      image_url: dto.image_url,
      position: dto.position
    });
  }

  async get(id: number): Promise<Image | null> {
    return this.images.get(id);
  }

  async update(id: number, url: string): Promise<Image | null> {
    return this.images.update(id, url);
  }

  async delete(id: number): Promise<void> {
    return this.images.delete(id);
  }
}
