import { S3Client } from "@aws-sdk/client-s3";

export const s3 = new S3Client({
  region: "auto",
  endpoint: process.env.BACK_BLAZE_BUCKET_URL!,
  credentials: {
    accessKeyId: process.env.BACK_BLAZE_KEY_ID!,
    secretAccessKey: process.env.BACK_BLAZE_KEY!
  }
});
