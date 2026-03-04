import styles from "./CreatePost.module.css";
import { Button } from "@/components/ui/button";
import { useState } from "react";

("use client");

import { Upload, X } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadList,
  FileUploadTrigger,
} from "@/components/ui/file-upload";

export default function CreatePost() {
  const [images, setImages] = useState<File[]>([]);

  const onFileValidate = React.useCallback(
    (file: File): string | null => {
      // Validate max images
      if (images.length >= 5) {
        return "You can only upload up to 5 photos";
      }

      // Validate file type (only images)
      if (!file.type.startsWith("image/")) {
        return "Only image files are allowed";
      }

      // Validate file/image size (max 2MB)
      const MAX_SIZE = 2 * 1024 * 1024; // 2MB
      if (file.size > MAX_SIZE) {
        return `File size must be less than ${MAX_SIZE / (1024 * 1024)}MB`;
      }

      return null;
    },
    [images],
  );

  const onFileReject = React.useCallback((file: File, message: string) => {
    toast(message, {
      description: `"${file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name}" has been rejected`,
    });
  }, []);

  async function handleCreatePost() {
    const formData = new FormData();

    images.forEach((file) => formData.append("images", file));

    console.log(images);

    console.log("post created");
  }

  return (
    <div className={styles.wrapper}>
      <form action={handleCreatePost}>
        <label htmlFor="location_name">Location Name</label>
        <input type="text" name="location_name" />
        <label htmlFor="caption">Caption</label>
        <input type="text" name="caption" />
        <label htmlFor="description">Description</label>
        <textarea name="descrition"></textarea>
        <label htmlFor="images">Photo(s)</label>
        <FileUpload
          value={images}
          onValueChange={setImages}
          onFileValidate={onFileValidate}
          onFileReject={onFileReject}
          accept="image/*"
          maxFiles={5}
          className="w-full max-w-md"
          multiple
        >
          <FileUploadDropzone>
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center justify-center rounded-full border p-2.5">
                <Upload className="size-6 text-muted-foreground" />
              </div>
              <p className="font-medium text-sm">Drag & drop files here</p>
              <p className="text-muted-foreground text-xs">
                Or click to browse (max 5 files)
              </p>
            </div>
            <FileUploadTrigger asChild>
              <Button variant="outline" size="sm" className="mt-2 w-fit">
                Browse files
              </Button>
            </FileUploadTrigger>
          </FileUploadDropzone>
          <FileUploadList>
            {images.map((image) => (
              <FileUploadItem key={image.name} value={image}>
                <FileUploadItemPreview />
                <FileUploadItemMetadata />
                <FileUploadItemDelete asChild>
                  <Button variant="ghost" size="icon" className="size-7">
                    <X />
                  </Button>
                </FileUploadItemDelete>
              </FileUploadItem>
            ))}
          </FileUploadList>
        </FileUpload>
        <Button variant="outline" type="submit">
          Create Post
        </Button>
      </form>
    </div>
  );
}
