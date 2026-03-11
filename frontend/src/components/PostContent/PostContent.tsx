import { markerIcon } from "@/lib/map-icons";
import { type LatLngExpression } from "leaflet";
import { useEffect, useMemo, useState } from "react";
import { MapContainer, Marker, Polyline, TileLayer } from "react-leaflet";
import styles from "./PostContent.module.css";
import "leaflet/dist/leaflet.css";
import { type Point, usePost } from "@/features/post";
import { useParams } from "react-router-dom";

import { HeartIcon, Trash2Icon } from "lucide-react";
import { Loading } from "../Loading/Loading";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Empty, EmptyContent, EmptyTitle } from "../ui/empty";

const toQueryString = (list: Point[]) => list.map(([lat, lng]) => `${lat},${lng}`).join(";");

export default function PostContent() {
  const { id } = useParams<{ id: string }>();
  let { post, isLoading, error } = usePost(Number(id));

  const [route, setRoute] = useState<LatLngExpression[]>([]);

  const queryString = useMemo(
    () =>
      post != null
        ? post?.route.coordinates.length >= 2
          ? toQueryString(post.route.coordinates)
          : null
        : null,
    [post?.route],
  );

  function myFitBounds({ markers }: any) {
    const map = useMap();
    useEffect(() => {
      if (markers.length >= 2) {
        const first = markers[0];
        const last = markers[markers.length - 1];

        map.fitBounds([first, last]);
      }
    }, [markers, map]);
    return null;
  }

  useEffect(() => {
    const fetchRoute = async () => {
      if (!queryString) return;

      try {
        const response = await fetch(
          `https://routing.openstreetmap.de/routed-foot/route/v1/walking/${queryString}?overview=full&geometries=geojson`,
        );

        const data = await response.json();
        console.log(data);

        if (data.routes?.[0]?.geometry?.coordinates) {
          const coords = data.routes[0].geometry.coordinates as [
            number,
            number,
          ][];
          const latLng: LatLngExpression[] = coords.map(([lng, lat]) => [
            lat,
            lng,
          ]);
          setRoute(latLng);
        }
      } catch (err) {
        console.error("Error fetching route:", err);
      }
    };

    fetchRoute();
  }, [queryString]);

  if (isLoading) return <Loading thing="post" />;
  if (!post) {
    return (
      <Empty>
        <EmptyTitle>404: Post not found</EmptyTitle>
        <EmptyContent>
          The post you're looking for doesn't exist or has been removed.
          <Button asChild>
            <a href="/">Go Home</a>
          </Button>
        </EmptyContent>
      </Empty>
    );
  }
  if (error) throw error;

  return (
    <div className={styles.wrapper}>
      <div className={styles.map} style={{ zIndex: 0, position: "relative" }}>
        <MapContainer
          center={[
            post.route.coordinates.at(0)![1],
            post.route.coordinates.at(0)![0],
          ]}
          zoom={15}
          style={{ height: "400px" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {myFitBounds(post.route)}
          {/* Waypoint markers */}
          {post.route.coordinates.map((point, i) => (
            <Marker
              key={point.join(";")}
              position={[point[1], point[0]]}
              icon={markerIcon(i, post.route.coordinates.length)}
            />
          ))}

          {/* FIXED: Use route state, not post.route */}
          {route.length > 0 && <Polyline positions={route} color="blue" weight={4} />}
        </MapContainer>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-bold">📍 {post.location_name}</p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm">78920</span>
              <Button variant="outline" size="icon" className="rounded-full">
                <HeartIcon className="size-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-primary">78921</span>
              <Button variant="outline" size="icon" className="rounded-full border-primary bg-primary/10">
                <HeartIcon className="size-[1.1rem] fill-primary text-primary" />
              </Button>
            </div>
          </div>
        </div>
        <a
          href={`/user/${post.owner_id}`}
          className="flex items-center gap-2 mb-2 w-fit hover:opacity-80 transition-opacity"
        >
          <Avatar className="size-7">
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">John Doe</span>
        </a>
        <div className="bg-muted rounded-xl p-4 mt-3">
          <p className="text-sm font-bold">Description</p>
          <p className="italic text-sm">{post.description}</p>
        </div>
      </div>

      <center>
        <Carousel
          className="w-full max-w-[27rem] md:px-8 px-0"
          opts={{ loop: true }}
        >
          <CarouselContent>
            {Array.from({ length: 5 }).map((_, index) => (
              <CarouselItem key={index}>
                <div className="p-1">
                  <Card className="py-0">
                    <CardContent className="px-0">
                      <img
                        className="rounded-xl aspect-landscape"
                        src="https://images.unsplash.com/photo-1462143338528-eca9936a4d09?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        alt="forest"
                        width="964"
                        height="643"
                      />
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselNext className="hidden md:flex" />
          <CarouselPrevious className="hidden md:flex" />
        </Carousel>
        <p>{post.caption}</p>
      </center>
      <div className="p-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:bg-destructive/10 hover:text-destructive gap-2"
            >
              <Trash2Icon className="size-4" />
              Delete post
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete post?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. The post and all its images will be permanently deleted.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button variant="destructive" onClick={() => console.log("delete post")}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
