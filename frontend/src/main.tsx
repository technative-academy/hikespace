import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./assets/css/index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { SWRConfig } from "swr";
import { routes } from "./routes.tsx";

const router = createBrowserRouter(routes);

const fetcher = (url: string) =>
  fetch(url).then(res => {
    if (!res.ok) throw new Error("Network error");
    return res.json();
  });

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SWRConfig value={{ fetcher, revalidateOnFocus: false }}>
      <RouterProvider router={router} />
    </SWRConfig>
  </StrictMode>,
);
