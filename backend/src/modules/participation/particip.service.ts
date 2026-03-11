import { PostRepository } from "#modules/post/post.repository.js";
import type { Particip, ParticipRepository } from "./particip.repository.js";
import type {
  CreateManyParticipDto,
  CreateParticipDto
} from "./particip.zod.js";

export class ParticipService {
  constructor(
    private readonly particips: ParticipRepository,
    private readonly posts: PostRepository
  ) {}

  async create(
    dto: CreateParticipDto,
    owner_id: string
  ): Promise<Particip | null> {
    if (!(await this.isOwner(dto.post_id, owner_id))) {
      return null;
    }
    return this.particips.create({
      user_id: dto.user_id,
      post_id: dto.post_id
    });
  }

  async createMany(
    dto: CreateManyParticipDto,
    owner_id: string
  ): Promise<Particip[] | null> {
    if (!(await this.isOwner(dto.postId, owner_id))) {
      return null;
    }
    return this.particips.createMany(dto.postId, dto.userIds);
  }

  async delete(id: number, owner_id: string): Promise<void> {
    if (!(await this.isOwner(id, owner_id))) {
      return;
    }
    this.particips.delete(id);
  }

  async isOwner(post_id: number, owner_id: string): Promise<boolean> {
    const post = await this.posts.get(post_id);
    if (!post) {
      return false;
    }
    if (post.owner_id !== owner_id) {
      return false;
    }
    return true;
  }
}
