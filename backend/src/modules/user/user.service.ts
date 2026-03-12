import type { UserRepository } from "./user.repository.js";
import type { PublicUser, UserRow, MeUser } from "./user.zod.js";
import { ImageHandler } from "#utils/image-handler.js";

export class UserService {
  constructor(private readonly users: UserRepository) {}

  imageHandler = new ImageHandler();

  async get(id: string, user_id?: string): Promise<PublicUser | null> {
    let getUser = await this.users.getPublicById(id, user_id);

    if (!getUser) {
      return null;
    }

    if (getUser.image) {
      getUser.image = await this.imageHandler.get(getUser.image);
    }

    return getUser;
  }

  async getMe(id: string): Promise<MeUser | null> {
    const user = await this.users.getById(id);
    if (!user) return null;

    if (user.image) {
      user.image = await this.imageHandler.get(user.image);
    }

    return user;
  }

  async getAll(): Promise<PublicUser[]> {
    return this.users.getPublicAll();
  }

  async updateImage(
    id: string,
    file?: Express.Multer.File | null
  ): Promise<void | null> {
    const user = await this.users.getById(id);

    if (!user) {
      return null;
    }

    if (user.image) {
      await this.imageHandler.delete(user.image);
    }

    if (file) {
      let imageKey = new Date().getTime().toString() + file.originalname;
      this.imageHandler.put(file.buffer, file.mimetype, imageKey);
      await this.users.setImageKey(id, imageKey);
    } else {
      this.users.setImageKey(id, null);
    }
  }

  async prepareAccountDeletion(id: string): Promise<void | null> {
    let user: MeUser | null = await this.users.getById(id);

    if (!user) {
      return null;
    }

    if (user.image) {
      await this.imageHandler.delete(user.image);
    }
  }
}
