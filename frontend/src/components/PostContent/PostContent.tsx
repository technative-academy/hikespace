import styles from "./PostContent.module.css";
import { MapContainer, TileLayer, Polyline, Marker } from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";

export default function PostContent() {
  const pointA: LatLngExpression = [50.82882, -0.140741];
  const pointB: LatLngExpression = [50.832346, -0.139791];

  // Extract coordinates
  const [lat1, lng1] = pointA;
  const [lat2, lng2] = pointB;

  // State to hold the actual route coordinates currently hardcorded coords for testing, will be updated with API response from actual post data
  const [route, setRoute] = useState<LatLngExpression[]>([]);

  useEffect(() => {
    const fetchRoute = async () => {
      try {
        // Openstreetmap API request: pointA -> pointB, get GeoJSON route for walking mode and pass to leaflet
        const response = await fetch(
          `https://routing.openstreetmap.de/routed-foot/route/v1/walking/${lng1},${lat1};${lng2},${lat2}?overview=full&geometries=geojson`,
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
  }, [pointA, pointB]);

  return (
    <div className={styles.wrapper}>
      <p>PostContent</p>
      <div className={styles.map}>
        <MapContainer center={pointA} zoom={15} style={{ height: "400px" }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={pointA} />
          <Marker position={pointB} />
          {/* Only render polyline once route is fetched */}
          {route.length > 0 && <Polyline positions={route} color="blue" />}
        </MapContainer>
      </div>
      <h1>Username</h1>
      <h2>LocationName</h2>
      <h3>Caption</h3>
      <p>
        the longggg description of the hike goes here, Lorem ipsum dolor sit
        amet, consectetur adipisicing elit. Sit, saepe! Quibusdam facere culpa
        esse dolore doloremque quo sed, saepe, ex ratione quia ducimus nulla
        suscipit perferendis accusantium.
      </p>
      {/* Possibly numOfLikes filled and unfilled hearts if user liked the post or not, conditional rendering to be implemented */}
      <p>(❤️ / ♡) 78920</p>
      <div className={styles.gallery}> image gallery goes here brrrrr </div>
    </div>
  );
}
