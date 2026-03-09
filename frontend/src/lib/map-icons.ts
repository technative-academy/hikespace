import { icon } from "leaflet";

const base = {
  shadowUrl: "/marker-shadow.png",
  iconSize: [25, 41] as [number, number],
  iconAnchor: [12, 41] as [number, number],
  popupAnchor: [1, -34] as [number, number],
  shadowSize: [41, 41] as [number, number],
};

export const redIcon = icon({
  ...base,
  iconUrl: "/marker-icon-red.png",
  iconRetinaUrl: "/marker-icon-2x-red.png",
});

export const greenIcon = icon({
  ...base,
  iconUrl: "/marker-icon-green.png",
  iconRetinaUrl: "/marker-icon-2x-green.png",
});

export const defaultIcon = icon({
  ...base,
  iconUrl: "/marker-icon.png",
  iconRetinaUrl: "/marker-icon-2x.png",
});

export function markerIcon(index: number, total: number) {
  if (index === 0) return redIcon;
  if (index === total - 1) return greenIcon;
  return defaultIcon;
}
