import type { ParticipRepository } from "./particip.repository.js";
import type { CreateParticipDto } from "./particip.zod.js";

export class ParticipService {
  constructor(private readonly particips: ParticipRepository) {}

  async create(dto: CreateParticipDto) {
    return this.particips.create({
      user_id: dto.user_id,
      post_id: dto.post_id
    });
  }

  async delete(id: number): Promise<void> {
    return this.particips.delete(id);
  }
}
