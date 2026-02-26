import type { LatLngExpression } from "leaflet";
import { useEffect, useState } from "react";
import { MapContainer, Marker, Polyline, TileLayer } from "react-leaflet";
import styles from "./PostContent.module.css";
import "leaflet/dist/leaflet.css";
import { type Point, usePost } from "@/features/post";
import { useParams } from "react-router-dom";
import { Card, CardContent } from "../ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel";

export default function PostContent() {
  const { id } = useParams<{ id: string }>();

  let { post, isLoading, error } = usePost(Number(id));

  // todo make this cleaner
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  // const pointA: LatLngExpression = [50.82882, -0.140741];
  // const pointB: LatLngExpression = [50.832346, -0.139791];

  // Extract coordinates
  // const [lat1, lng1] = pointA;
  // const [lat2, lng2] = pointB;

  const toQueryString = (list: Point[]) => list.map(([lat, long]) => `${lat},${long}`).join(";");

  // State to hold the actual route coordinates currently hardcorded coords for testing, will be updated with API response from actual post data
  const [route, setRoute] = useState<LatLngExpression[]>([]);

  useEffect(() => {
    const fetchRoute = async () => {
      try {
        // Openstreetmap API request: pointA -> pointB, get GeoJSON route for walking mode and pass to leaflet
        const response = await fetch(
          `https://routing.openstreetmap.de/routed-foot/route/v1/walking/${
            toQueryString(post.route)
          }?overview=full&geometries=geojson`,
        );

        const data = await response.json();

        // Extract coordinates and convert them [lng, lat] -> [lat, lng] for Leaflet to map
        const coords = data.routes[0].geometry.coordinates as [
          number,
          number,
        ][];
        const latLng: LatLngExpression[] = coords.map(([lng, lat]) => [
          lat,
          lng,
        ]);

        setRoute(latLng);
      } catch (err) {
        console.error("Error fetching route:", err);
      }
    };

    fetchRoute();
  }, [post]);

  return (
    <div className={styles.wrapper}>
      <p>PostContent</p>
      <div className={styles.map}>
        <MapContainer center={post.route.at(0)!} zoom={15} style={{ height: "400px" }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {post.route.map((point) => <Marker key={point.join(";")} position={point} />)}
          {/* Only render polyline once route is fetched */}
          {route.length > 0 && <Polyline positions={post.route} color="blue" />}
        </MapContainer>
      </div>
      <h1>User {post.owner_id}</h1>
      <h2>{post.location_name}</h2>
      <h3>{post.caption}</h3>
      <p>
        {post.description}
      </p>
      {/* Possibly numOfLikes filled and unfilled hearts if user liked the post or not, conditional rendering to be implemented */}
      <p>(❤️ / ♡) 78920</p>

      <center>
        <Carousel className="w-full max-w-[27rem] sm:max-w-xs p-2">
          <CarouselContent>
            {Array.from({ length: 5 }).map((_, index) => (
              <CarouselItem key={index}>
                <div className="p-1">
                  <Card>
                    <CardContent className="flex aspect-landscape items-center justify-center p-6">
                      <span className="text-4xl font-semibold">{index + 1}</span>
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
