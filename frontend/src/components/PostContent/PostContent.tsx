import type { LatLngExpression } from "leaflet";
import { useEffect, useState, useMemo } from "react";
import { MapContainer, Marker, Polyline, TileLayer } from "react-leaflet";
import styles from "./PostContent.module.css";
import "leaflet/dist/leaflet.css";
import { type Point, usePost } from "@/features/post";
import { useParams } from "react-router-dom";
import { Card, CardContent } from "../ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";

export default function PostContent() {
  const { id } = useParams<{ id: string }>();
  let { post, isLoading, error } = usePost(Number(id));

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  // Fix: OSRM needs longitude,latitude format
  const toQueryString = (list: Point[]) =>
    list.map(([lat, lng]) => `${lng},${lat}`).join(";");

  const [route, setRoute] = useState<LatLngExpression[]>([]);

  const queryString = useMemo(
    () => (post.route?.length >= 2 ? toQueryString(post.route) : null),
    [post.route],
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

  return (
    <div className={styles.wrapper}>
      <p>PostContent</p>
      <div className={styles.map}>
        <MapContainer
          center={post.route.at(0)!}
          zoom={15}
          style={{ height: "400px" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {/* Waypoint markers */}
          {post.route.map((point) => (
            <Marker key={point.join(";")} position={point} />
          ))}

          {/* FIXED: Use route state, not post.route */}
          {route.length > 0 && (
            <Polyline positions={route} color="blue" weight={4} />
          )}
        </MapContainer>
      </div>
      <h1>User {post.owner_id}</h1>
      <h2>{post.location_name}</h2>
      <h3>{post.caption}</h3>
      <p>{post.description}</p>
      <p>(❤️ / ♡) 78920</p>

      <center>
        <Carousel className="w-full max-w-[27rem] sm:max-w-xs p-2">
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
      </center>
    </div>
  );
}
