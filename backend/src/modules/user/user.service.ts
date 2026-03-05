import type { UserRepository } from "./user.repository.js";
import type { User, CreateUserDto, UpdateUserDto } from "./user.zod.js";
import { s3 } from "../../config/s3.js";
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { hashPassword } from "../../utils/password.js";

export class UserService {
  constructor(private readonly users: UserRepository) {}

  async create(dto: CreateUserDto) {
    const passwordHash = await hashPassword(dto.password);

    return this.users.create({
      email: dto.email,
      username: dto.username,
      password_hash: passwordHash
    });
  }

  async get(id: number): Promise<User | null> {
    let getUser = await this.users.get(id);

    if (!getUser) {
      return null;
    }

    if (getUser.image_url) {
      const getCommand = new GetObjectCommand({
        Bucket: process.env.BACK_BLAZE_BUCKET_NAME!,
        Key: getUser.image_url
      });

      const backblazeUrl = await getSignedUrl(s3, getCommand, {
        expiresIn: 3600
      });

      getUser.image_url = backblazeUrl;
    }

    return getUser;
  }

  async getAll(): Promise<User[]> {
    return this.users.getAll();
  }

  async update(
    id: number,
    data: UpdateUserDto,
    file?: Express.Multer.File | undefined
  ): Promise<User | null> {
    const getUser = await this.users.get(id);

    if (!getUser) {
      return null;
    }

    if (file) {
      if (getUser.image_url) {
        await s3.send(
          new DeleteObjectCommand({
            Bucket: process.env.BACK_BLAZE_BUCKET_NAME!,
            Key: getUser.image_url
          })
        );
      }
      let imageKey = new Date().getTime().toString() + file.originalname;
      await s3.send(
        new PutObjectCommand({
          Bucket: process.env.BACK_BLAZE_BUCKET_NAME!,
          Body: file.buffer,
          ContentType: file.mimetype,
          Key: imageKey
        })
      );

      let imageUpdate = await this.users.update(id, {
        ...data,
        image_url: imageKey
      });

      return imageUpdate;
    } else {
      return this.users.update(id, data);
    }
  }

  async delete(id: number): Promise<void | null> {
    let getUser: User | null = await this.users.get(id);

    if (!getUser) {
      return null;
    }

    if (getUser.image_url) {
      await s3.send(
        new DeleteObjectCommand({
          Bucket: process.env.BACK_BLAZE_BUCKET_NAME!,
          Key: getUser.image_url
        })
      );
    }

    return this.users.delete(id);
  }
}
