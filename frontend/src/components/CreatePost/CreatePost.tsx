import styles from "./CreatePost.module.css";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function CreatePost() {
  const [images, setImages] = useState<File[]>([]);

  function handleImageChange(event: any) {
    const files = Array.from(event.target.files) as File[];
    setImages(files);
    console.log("image got");
  }

  function imageUpload(formData: FormData) {
    images.forEach((file) => formData.append("images", file));
    console.log(`images uploaded: ${images.length}`);
  }

  async function handleCreatePost() {
    const formData = new FormData();

    imageUpload(formData);

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
        <input
          type="file"
          accept="image/*"
          multiple
          name="images"
          onChange={handleImageChange}
        />
        <Button variant="outline" onClick={() => imageUpload(new FormData())}>
          Upload Image
        </Button>
        <Button variant="outline" type="submit">
          Create Post
        </Button>
      </form>
    </div>
  );
}
