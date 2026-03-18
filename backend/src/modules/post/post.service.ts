import type { PostRepository } from "./post.repository.js";
import type {
  Post,
  PopulatedPost,
  CreatePostDto,
  UpdatePostDto
} from "./post.zod.js";
import { ImageHandler } from "#utils/image-handler.js";

export class PostService {
  constructor(private readonly posts: PostRepository) {}

  imageHandler = new ImageHandler();

  async create(dto: CreatePostDto) {
    return this.posts.create({
      owner_id: dto.owner_id,
      description: dto.description,
      route: dto.route,
      location_name: dto.location_name,
      caption: dto.caption
    });
  }

  async get(id: number, userId: string): Promise<PopulatedPost | null> {
    let post = await this.posts.getPopulated(id, userId);
    if (post) {
      let urls = await this.imageHandler.getMany(post.images);
      await Promise.all(
        post.images.map(async (image, idx) => {
          image.image_url = urls[idx];
        })
      );
      await Promise.all(
        post.participations.map(async (p) => {
          if (p.image) p.image = await this.imageHandler.get(p.image);
        })
      );
    }
    return post;
  }

  async getAll(): Promise<PopulatedPost[]> {
    let posts = await this.posts.getAll();
    return await this.assignImagesUrl(posts);
  }

  async getFromFollowing(id: string): Promise<PopulatedPost[]> {
    let posts = await this.posts.getFromFollowing(id);
    return await this.assignImagesUrl(posts);
  }

  async getByUser(id: string): Promise<PopulatedPost[] | null> {
    const posts = await this.posts.getByUser(id);
    if (!posts) {
      return null;
    }
    return await this.assignImagesUrl(posts);
  }

  async likedByUser(id: string): Promise<PopulatedPost[] | null> {
    let posts = await this.posts.likedByUser(id);
    if (!posts) {
      return null;
    }
    return await this.assignImagesUrl(posts);
  }

  async update(id: number, data: UpdatePostDto): Promise<Post | null> {
    return this.posts.update(id, data);
  }

  async delete(id: number): Promise<void> {
    return this.posts.delete(id);
  }

  async assignImagesUrl(posts: PopulatedPost[]): Promise<PopulatedPost[]> {
    let result = await Promise.all(
      posts.map(async (post) => {
        let urls = await this.imageHandler.getMany(post.images);
        post.images.map(async (image, idx) => {
          image.image_url = urls[idx];
        });
        return post;
      })
    );
    return result;
  }
}
