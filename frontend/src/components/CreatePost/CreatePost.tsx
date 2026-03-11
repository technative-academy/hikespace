import styles from "./CreatePost.module.css";
import { Button } from "@/components/ui/button";
import { useState, useRef, useMemo, useEffect } from "react";

("use client");

import { Upload, X } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
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
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import { type Point } from "@/features/post";
import { markerIcon } from "@/lib/map-icons";
import { useUsers } from "@/features/user";
import { authClient } from "@/lib/auth-client";

// set type for marker
type MarkerType = {
  id: number;
  position: LatLngExpression;
};

export default function CreatePost() {
  const navigate = useNavigate();
  const { data: session, isPending } = authClient.useSession();
  const { users } = useUsers();

  if (!isPending && !session) {
    navigate("/auth");
    return null;
  }

  const anchor = useComboboxAnchor();

  const formRef = useRef<HTMLFormElement>(null);

  const [images, setImages] = useState<File[]>([]);

  const [selectedParticipation, setSelectedParticipation] = useState<string[]>(
    [],
  );

  const [markers, setMarkers] = useState<MarkerType[]>([]);

  // testing for map trail routing
  const toQueryString = (list: Point[]) =>
    list.map(([lat, long]) => `${long},${lat}`).join(";");

  const [myRoute, setMyRoute] = useState<LatLngExpression[]>([]);

  const queryString = useMemo(
    () =>
      markers?.length >= 2
        ? toQueryString(markers.map((m) => m.position as Point))
        : null,
    [markers], // Only to be recalculated when markers change
  );

  useEffect(() => {
    const fetchRoute = async () => {
      try {
        // Openstreetmap API request: pointA -> pointB, get GeoJSON route for walking mode and pass to leaflet
        const response = await fetch(
          `https://routing.openstreetmap.de/routed-foot/route/v1/walking/${toQueryString(
            markers.map((m) => m.position as Point),
          )}?overview=full&geometries=geojson`,
        );

        const data = await response.json();

        // Extract coordinates and convert them [lng, lat] -> [lat, lng] for Leaflet to map
        const coords = data.routes[0].geometry.coordinates as [
          number,
          number,
        ][];

        const reversedCoords = coords.map(
          ([lng, lat]) => [lat, lng] as LatLngExpression,
        );

        setMyRoute(reversedCoords);
      } catch (error) {
        console.error("Error fetching route:", error);
      }
    };

    if (queryString) {
      fetchRoute();
    }
  }, [queryString]);

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

  // delete selected marker from list
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

  async function handleCreatePost(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (markers.length < 2) {
      toast.error("Please add at least 2 points on the map to create a route");
      return;
    }

    const formData = new FormData(event.target as HTMLFormElement);
    const description = formData.get("description") as string;
    const location_name = formData.get("location_name") as string;
    const caption = formData.get("caption") as string;

    // Convert user's markers from Leaflet [lat, lng] to GeoJSON [lng, lat]
    const geoRoute = {
      type: "LineString" as const,
      coordinates: markers.map(({ position }) => {
        const [lat, lng] = position as [number, number];
        return [lng, lat];
      }),
    };

    // 1. Create post
    const postRes = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        description,
        location_name,
        caption,
        route: geoRoute,
      }),
      credentials: "include",
    });
    if (!postRes.ok) {
      toast.error("Failed to create post");
      return;
    }
    const createdPost = await postRes.json();

    // 2. Upload images (if any)
    if (images.length > 0) {
      const fd = new FormData();
      fd.append("post_id", String(createdPost.id));
      fd.append(
        "metadata",
        JSON.stringify(images.map((_, i) => ({ position: i }))),
      );
      images.forEach((f) => fd.append("images", f));
      const imgRes = await fetch("/api/images", {
        method: "POST",
        body: fd,
        credentials: "include",
      });
      if (!imgRes.ok) toast.error("Post created but image upload failed");
    }

    // 3. Tag participants
    if (selectedParticipation.length > 0) {
      await Promise.all(
        selectedParticipation.map((userId) =>
          fetch("/api/participations", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: userId, post_id: createdPost.id }),
            credentials: "include",
          }),
        ),
      );
    }

    // Reset form and state
    formRef.current?.reset();
    setImages([]);
    setSelectedParticipation([]);
    setMarkers([]);

    navigate(`/post/${createdPost.id}`);
  }

  return (
    <div className={styles.wrapper}>
      <form ref={formRef} onSubmit={handleCreatePost}>
        <FieldSet>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="location_name">Location Name</FieldLabel>
              <Input
                id="location_name"
                type="text"
                name="location_name"
                placeholder="Brighton"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="caption">Caption</FieldLabel>
              <Input
                id="caption"
                type="text"
                name="caption"
                placeholder="Seven Sisters Insane Summer Hike"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="description">Description</FieldLabel>
              <Textarea id="description" name="description" />
            </Field>
          </FieldGroup>
        </FieldSet>
        <Label htmlFor="participation">Tag friends</Label>
        <Combobox
          multiple
          autoHighlight
          items={users
            .filter((u) => u.id != session?.user.id)
            .map((u: { id: string }) => u.id)}
          value={selectedParticipation}
          onValueChange={setSelectedParticipation}
        >
          <ComboboxChips ref={anchor} className="w-full max-w-xs">
            <ComboboxValue>
              {(values) => (
                <React.Fragment>
                  {(values as string[]).map((id) => {
                    const user = users.find((u: { id: string }) => u.id === id);
                    return (
                      <ComboboxChip key={id}>
                        <Avatar className="h-4 w-4">
                          {user?.image && <AvatarImage src={user.image} />}
                        </Avatar>
                        {user?.name ?? id}
                      </ComboboxChip>
                    );
                  })}
                  <ComboboxChipsInput />
                </React.Fragment>
              )}
            </ComboboxValue>
          </ComboboxChips>
          <ComboboxContent anchor={anchor} className="z-[9999]">
            <ComboboxEmpty>No items found.</ComboboxEmpty>
            <ComboboxList>
              {(id) => {
                const user = users.find((u: { id: string }) => u.id === id);
                return (
                  <ComboboxItem key={id} value={id}>
                    <Avatar>
                      {user?.image && <AvatarImage src={user.image} />}
                    </Avatar>
                    {user?.name ?? id}
                  </ComboboxItem>
                );
              }}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
        <Label htmlFor="markers">Pin your journey</Label>
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

          {markers.map((marker, i) => (
            <Marker
              key={marker.id}
              position={marker.position}
              icon={markerIcon(i, markers.length)}
              eventHandlers={{
                click: () => deleteMarker(marker.id),
              }}
            />
          ))}

          {route.length > 1 && <Polyline positions={myRoute} />}
        </MapContainer>
        <Label htmlFor="images">Photo(s)</Label>
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
