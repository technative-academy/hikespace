import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { type Post } from "@/features/post";
import { PencilIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { mutate } from "swr";

interface EditPostModalProps {
  post: Post;
  onSuccess?: () => void;
  onDelete?: () => void;
}

export default function EditPostModal({ post, onSuccess, onDelete }: EditPostModalProps) {
  const [open, setOpen] = useState(false);
  const [locationName, setLocationName] = useState(post.location_name ?? "");
  const [description, setDescription] = useState(post.description ?? "");
  const [caption, setCaption] = useState(post.caption ?? "");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch(`/api/posts/${post.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          location_name: locationName,
          description,
          caption,
        }),
      });
      if (!res.ok) throw new Error("Failed to save");
      toast.success("Post updated");
      await mutate(`/api/posts/${post.id}`);
      onSuccess?.();
      setOpen(false);
    } catch {
      toast.error("Failed to update post");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" aria-label="Edit post">
          <PencilIcon className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit post</DialogTitle>
          <DialogDescription>Update the post details.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-2">
          <Field>
            <FieldLabel htmlFor="location-name">Location name</FieldLabel>
            <Input
              id="location-name"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              placeholder="Location name"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="description">Description</FieldLabel>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the hike..."
              rows={4}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="caption">Caption</FieldLabel>
            <Input
              id="caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Caption"
            />
          </Field>
        </div>
        <DialogFooter>
          <Button
            variant="ghost"
            className="mr-auto text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={onDelete}
            disabled={saving}
          >
            <Trash2Icon className="size-4" />
            Delete post
          </Button>
          <DialogClose asChild>
            <Button variant="outline" disabled={saving}>Cancel</Button>
          </DialogClose>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
