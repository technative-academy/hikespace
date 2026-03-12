import type { LikeRepository } from "./like.repository.js";
import type { Like, CreateLikeDto } from "./like.zod.js";
import { PostService } from "#modules/post/post.service.js";
import { PostRepository } from "#modules/post/post.repository.js";
import { UserService } from "#modules/user/user.service.js";
import { UserRepository } from "#modules/user/user.repository.js";

export class LikeService {
  constructor(private readonly likes: LikeRepository) {}

  postRepository = new PostRepository();
  userService = new UserService(new UserRepository());

  async create(dto: CreateLikeDto, userId: string): Promise<Like | null> {
    const postCheck = await this.postRepository.get(dto.post_id);
    const userCheck = await this.userService.get(userId);

    if (!postCheck || !userCheck) {
      return null;
    }

    return this.likes.create({
      post_id: dto.post_id,
      user_id: userId
    });
  }

  async delete(id: number, userId: string): Promise<boolean> {
    return this.likes.delete(id, userId);
  }
}
