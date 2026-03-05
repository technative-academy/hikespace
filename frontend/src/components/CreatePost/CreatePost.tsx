import styles from "./CreatePost.module.css";
import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";

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

import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox";

import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMapEvents,
} from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";

import { Avatar, AvatarImage } from "@/components/ui/avatar";

type MarkerType = {
  id: number;
  position: LatLngExpression;
};

export default function CreatePost() {
  const frameworks = ["Pete", "Pete again", "Not Pete"] as const; // for testing, will swap to real users after it works as intended

  const anchor = useComboboxAnchor();

  const formRef = useRef<HTMLFormElement>(null);

  const [images, setImages] = useState<File[]>([]);

  const [selectedParticipation, setSelectedParticipation] = useState<string[]>([
    frameworks[0],
  ]);

  const [markers, setMarkers] = useState<MarkerType[]>([]);

  // component to handle map clicks
  function AddMarker() {
    useMapEvents({
      click(e) {
        const newMarker: MarkerType = {
          id: Date.now(),
          position: [e.latlng.lat, e.latlng.lng],
        };

        setMarkers((prev) => [...prev, newMarker]);
      },
    });

    return null;
  }

  function deleteMarker(id: number) {
    setMarkers((prev) => prev.filter((marker) => marker.id !== id));
  }

  const route = markers.map((m) => m.position);

  // handle image files
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

  async function handleCreatePost(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault(); // Prevent the default form submission
    const formData = new FormData(event.target as HTMLFormElement); // Get data from the form

    // Append images from state (since they're not in the form inputs)
    images.forEach((file) => formData.append("images", file));

    // append markers from state
    (formData.append("routes", JSON.stringify(route)),
      // Reset the form and state
      formRef.current?.reset());
    setImages([]);
    setSelectedParticipation([]);
    setMarkers([]);

    // Log all FormData entries for debugging
    console.log("FormData entries:");
    for (const [key, value] of formData.entries()) {
      console.log(key, value);
    }

    console.log("post created");
  }

  return (
    <div className={styles.wrapper}>
      <form ref={formRef} onSubmit={handleCreatePost}>
        <label htmlFor="location_name">Location Name</label>
        <input type="text" name="location_name" />
        <label htmlFor="caption">Caption</label>
        <input type="text" name="caption" />
        <label htmlFor="description">Description</label>
        <textarea name="description"></textarea>
        <label htmlFor="participation">Tag friends</label>
        <Combobox
          multiple
          autoHighlight
          items={frameworks}
          defaultValue={[frameworks[0]]}
          value={selectedParticipation}
          onValueChange={setSelectedParticipation}
        >
          <ComboboxChips ref={anchor} className="w-full max-w-xs">
            <ComboboxValue>
              {(values) => (
                <React.Fragment>
                  {values.map((value: string) => (
                    <ComboboxChip key={value}>
                      <Avatar className="h-4 w-4">
                        <AvatarImage src="https://github.com/orangespaceman.png"></AvatarImage>
                      </Avatar>
                      {value}
                    </ComboboxChip>
                  ))}
                  <ComboboxChipsInput />
                </React.Fragment>
              )}
            </ComboboxValue>
          </ComboboxChips>
          <ComboboxContent anchor={anchor} className="z-[9999]">
            <ComboboxEmpty>No items found.</ComboboxEmpty>
            <ComboboxList>
              {(item) => (
                <ComboboxItem key={item} value={item}>
                  <Avatar>
                    <AvatarImage src="https://github.com/orangespaceman.png"></AvatarImage>
                  </Avatar>
                  {item}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
        <input
          type="hidden"
          name="participation"
          value={JSON.stringify(selectedParticipation)}
        />
        <label htmlFor="markers">Pin your journey</label>
        <MapContainer
          center={[50.82882, -0.140741]}
          zoom={13}
          style={{ height: "500px", width: "100%", zIndex: 0 }}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <AddMarker />

          {markers.map((marker) => (
            <Marker
              key={marker.id}
              position={marker.position}
              eventHandlers={{
                click: () => deleteMarker(marker.id),
              }}
            />
          ))}

          {route.length > 1 && <Polyline positions={route} />}
        </MapContainer>
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
