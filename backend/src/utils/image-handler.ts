import { Image } from "#modules/image/image.zod.js";
import { s3 } from "../config/s3.js";
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export class ImageHandler {

  async put(body: Buffer, mimeType: string, key: string) {
    await s3.send(new PutObjectCommand({
      Bucket: process.env.BACK_BLAZE_BUCKET_NAME!,
      Body: body,
      ContentType: mimeType,
      Key: key
    }));
  }

  async get(key: string): Promise<string> {
    const getCommand = new GetObjectCommand({
      Bucket: process.env.BACK_BLAZE_BUCKET_NAME!,
      Key: key
    });

    const backblazeUrl = await getSignedUrl(s3, getCommand, {
      expiresIn: 3600
    });

    return backblazeUrl;
  }

  async getMany(images: Image[]): Promise<string[]> {
    let result = await Promise.all(
      images.map(async (image) => {
        let backblazeUrl = await this.get(image.image_url);
        return backblazeUrl;
      })
    );
    return result;
  }

  async delete(key: string) {
    await s3.send(new DeleteObjectCommand({
      Bucket: process.env.BACK_BLAZE_BUCKET_NAME!,
      Key: key
    }))
  }
}