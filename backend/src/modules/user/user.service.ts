import type { UserRepository } from "./user.repository.js";
import type { PublicUser, UserRow } from "./user.zod.js";
import { s3 } from "../../config/s3.js";
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export class UserService {
  constructor(private readonly users: UserRepository) {}

  async get(id: string, user_id?: string): Promise<PublicUser | null> {
    let getUser = await this.users.getPublicById(id, user_id);

    if (!getUser) {
      return null;
    }

    if (getUser.image) {
      const getCommand = new GetObjectCommand({
        Bucket: process.env.BACK_BLAZE_BUCKET_NAME!,
        Key: getUser.image
      });

      const backblazeUrl = await getSignedUrl(s3, getCommand, {
        expiresIn: 3600
      });

      getUser.image = backblazeUrl;
    }

    return getUser;
  }

  async getMe(id: string) {
    const user = await this.users.getById(id);
    if (!user) return null;

    if (user.image) {
      const getCommand = new GetObjectCommand({
        Bucket: process.env.BACK_BLAZE_BUCKET_NAME!,
        Key: user.image
      });

      const backblazeUrl = await getSignedUrl(s3, getCommand, {
        expiresIn: 3600
      });

      user.image = backblazeUrl;
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      imageKey: user.image,
      image_url: user.image
    };
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
      await s3.send(
        new DeleteObjectCommand({
          Bucket: process.env.BACK_BLAZE_BUCKET_NAME!,
          Key: user.image
        })
      );
    }

    if (file) {
      let imageKey = new Date().getTime().toString() + file.originalname;
      await s3.send(
        new PutObjectCommand({
          Bucket: process.env.BACK_BLAZE_BUCKET_NAME!,
          Body: file.buffer,
          ContentType: file.mimetype,
          Key: imageKey
        })
      );

      await this.users.setImageKey(id, imageKey);
    } else {
      this.users.setImageKey(id, null);
    }
  }

  async prepareAccountDeletion(id: string): Promise<void | null> {
    let user: UserRow | null = await this.users.getById(id);

    if (!user) {
      return null;
    }

    if (user.image) {
      await s3.send(
        new DeleteObjectCommand({
          Bucket: process.env.BACK_BLAZE_BUCKET_NAME!,
          Key: user.image
        })
      );
    }
  }
}
