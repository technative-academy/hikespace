import type { LatLngExpression } from "leaflet";
import { useEffect, useState, useMemo } from "react";
import { MapContainer, Marker, Polyline, TileLayer } from "react-leaflet";
import styles from "./PostContent.module.css";
import "leaflet/dist/leaflet.css";
import { type Point, usePost } from "@/features/post";
import { useParams } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner"

import PostNotFound from "./PostNotFound";
import { Card, CardContent } from "../ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";

const toQueryString = (list: Point[]) =>
  list.map(([lat, lng]) => `${lat},${lng}`).join(";");

export default function PostContent() {
  const { id } = useParams<{ id: string }>();
  let { post, isLoading, error } = usePost(Number(id));

  const [route, setRoute] = useState<LatLngExpression[]>([]);

  const queryString = useMemo(
    () => (post != null ? post?.route.coordinates.length >= 2 ? toQueryString(post.route.coordinates) : null : null),
    [post?.route],
  );

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner /> &nbsp; Loading post...
      </div>
    );
  }

  if (error || !post || !post.route || !post.route.coordinates || post.route.coordinates.length === 0) {
    return <PostNotFound />;
  }

  return (
    <div className={styles.wrapper}>

      <div className={styles.map}>
        <MapContainer
          center={[post.route.coordinates.at(0)![1], post.route.coordinates.at(0)![0]]}
          zoom={15}
          style={{ height: "400px" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {/* Waypoint markers */}
          {post.route.coordinates.map((point) => (
            <Marker key={point.join(";")} position={[point[1], point[0]]} />
          ))}

          {/* FIXED: Use route state, not post.route */}
          {route.length > 0 && (
            <Polyline positions={route} color="blue" weight={4} />
          )}
        </MapContainer>
      </div>
      <div className="p-4">
        <p className="text-lg font-bold">📍 {post.location_name}</p>
        <p className="italic">{post.description}</p>
        <p>❤️ 78920</p>
      </div>

      <center>
        <Carousel className="w-full max-w-[27rem] md:px-8 px-0" opts={{ loop: true }}>
          <CarouselContent>
            {Array.from({ length: 5 }).map((_, index) => (
              <CarouselItem key={index}>
                <div className="p-1">
                  <Card>
                    <CardContent className="flex aspect-landscape items-center justify-center p-6">
                      <span className="text-4xl font-semibold">
                        {index + 1}
                      </span>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselNext />
          <CarouselPrevious />
        </Carousel>
        <p>{post.caption}</p>
      </center>

    </div>
  );
}
