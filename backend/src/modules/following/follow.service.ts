import type { FollowRepository } from "./follow.repository.js";
import type { Follow, CreateFollowDto } from "./follow.zod.js";
import { UserService } from "#modules/user/user.service.js";
import { UserRepository } from "#modules/user/user.repository.js";

export class FollowService {
  constructor(private readonly follows: FollowRepository) {}

  userService = new UserService(new UserRepository());

  async create(dto: CreateFollowDto): Promise<Follow | null> {
    const userCheck = await this.userService.get(dto.following_id);

    if (!userCheck) {
      return null;
    }

    return this.follows.create({
      follower_id: dto.follower_id,
      following_id: dto.following_id
    });
  }

  async delete(currentUserId: string, targetUserId: string): Promise<void> {
    return this.follows.delete(currentUserId, targetUserId);
  }
}
