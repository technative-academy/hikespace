import type { LikeRepository } from "./like.repository.js";
import type { Like, CreateLikeDto } from "./like.zod.js";
import { PostService } from "#modules/post/post.service.js";
import { PostRepository } from "#modules/post/post.repository.js";
import { UserService } from "#modules/user/user.service.js";
import { UserRepository } from "#modules/user/user.repository.js";

export class LikeService {
  constructor(private readonly likes: LikeRepository) {}

  postService = new PostService(new PostRepository());
  userService = new UserService(new UserRepository());

  async create(dto: CreateLikeDto): Promise<Like | null> {
    const postCheck = await this.postService.get(dto.post_id);
    const userCheck = await this.userService.get(dto.user_id);

    if (!postCheck || !userCheck) {
      return null;
    }

    return this.likes.create({
      post_id: dto.post_id,
      user_id: dto.user_id
    });
  }

  async delete(id: number): Promise<void> {
    return this.likes.delete(id);
  }
}
