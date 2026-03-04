import type { PostRepository } from "./post.repository.js";
import type { Post, CreatePostDto, UpdatePostDto } from "./post.zod.js";

export class PostService {
  constructor(private readonly posts: PostRepository) {}

  async create(dto: CreatePostDto) {
    return this.posts.create({
      owner_id: dto.owner_id,
      description: dto.description,
      route: dto.route,
      location_name: dto.location_name,
      caption: dto.caption
    });
  }

  async get(id: number): Promise<Post | null> {
    return this.posts.get(id);
  }

  async getAll(): Promise<Post[]> {
    return this.posts.getAll();
  }

  async update(id: number, data: UpdatePostDto): Promise<Post | null> {
    return this.posts.update(id, data);
  }

  async delete(id: number): Promise<void> {
    return this.posts.delete(id);
  }
}
