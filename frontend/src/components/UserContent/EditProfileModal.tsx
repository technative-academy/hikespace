import { useState, useCallback } from "react";
import { SettingsIcon, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { mutate } from "swr";
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

interface EditProfileModalProps {
  user: { name?: string };
  onSuccess?: () => void;
}

export default function EditProfileModal({ user, onSuccess }: EditProfileModalProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(user.name ?? "");
  const [avatar, setAvatar] = useState<File[]>([]);
  const [saving, setSaving] = useState(false);

  const onFileValidate = useCallback((file: File): string | null => {
    if (!file.type.startsWith("image/")) return "Only image files are allowed";
    if (file.size > 2 * 1024 * 1024) return "File size must be less than 2MB";
    return null;
  }, []);

  const onFileReject = useCallback((file: File, message: string) => {
    toast(message, {
      description: `"${file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name}" has been rejected`,
    });
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      if (name !== user.name) {
        await authClient.updateUser({ name });
      }
      if (avatar.length > 0) {
        const fd = new FormData();
        fd.append("profile_picture", avatar[0]);
        const res = await fetch("/api/users/avatar", {
          method: "PUT",
          body: fd,
          credentials: "include",
        });
        if (!res.ok) throw new Error("Avatar upload failed");
      }
      toast.success("Profile updated");
      await mutate("/api/users/me");
      onSuccess?.();
      setOpen(false);
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Edit profile">
          <SettingsIcon className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Update your display name and profile picture.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-2">
          <Field>
            <FieldLabel htmlFor="display-name">Display name</FieldLabel>
            <Input
              id="display-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
          </Field>
          <Field>
            <FieldLabel>Profile picture</FieldLabel>
            <FileUpload
              value={avatar}
              onValueChange={setAvatar}
              onFileValidate={onFileValidate}
              onFileReject={onFileReject}
              accept="image/*"
              maxFiles={1}
              className="w-full"
            >
              <FileUploadDropzone>
                <div className="flex flex-col items-center gap-1">
                  <div className="flex items-center justify-center rounded-full border p-2.5">
                    <Upload className="size-5 text-muted-foreground" />
                  </div>
                  <p className="font-medium text-sm">Drag & drop image here</p>
                  <p className="text-muted-foreground text-xs">Max 2MB</p>
                </div>
                <FileUploadTrigger asChild>
                  <Button variant="outline" size="sm" className="mt-2 w-fit">
                    Browse
                  </Button>
                </FileUploadTrigger>
              </FileUploadDropzone>
              <FileUploadList>
                {avatar.map((file) => (
                  <FileUploadItem key={file.name} value={file}>
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
          </Field>
        </div>
        <DialogFooter>
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
