import { createBrowserRouter } from "react-router";
import Root from "./pages/Root";
import MapPage from "./pages/MapPage";
import NearbyPage from "./pages/NearbyPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,  
    children: [
      { index: true, Component: MapPage },
      { path: "perto-de-si", Component: NearbyPage },
    ],
  },
]);
