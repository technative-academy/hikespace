import type { UserRepository } from "./user.repository.js";
import type { User, CreateUserDto, UpdateUserDto } from "./user.zod.js";
import { hashPassword } from "../../utils/password.js";

export class UserService {
  constructor(private readonly users: UserRepository) {}

  async create(dto: CreateUserDto) {
    const passwordHash = await hashPassword(dto.password);

    return this.users.create({
      email: dto.email,
      username: dto.username,
      password_hash: passwordHash,
      image_url: dto.image_url ?? null
    });
  }

  async get(id: number): Promise<User | null> {
    return this.users.get(id);
  }

  async getAll(): Promise<User[]> {
    return this.users.getAll();
  }

  async update(id: number, data: UpdateUserDto): Promise<User | null> {
    return this.users.update(id, data);
  }

  async delete(id: number): Promise<void> {
    return this.users.delete(id);
  }
}
