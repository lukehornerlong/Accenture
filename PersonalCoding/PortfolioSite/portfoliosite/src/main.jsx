import React from "react";
import { createHashRouter, RouterProvider } from "react-router-dom";
import ReactDOM from "react-dom/client";
import Root from "./route";
import LandingPage from "./pages/LandingPage";
import CVPage from "./pages/CV";
const elRoot = document.getElementById("root");
const isLanding = !window.location.href.includes("#");
const RootPath = window.location.pathname.replace("/", "");
const router = createHashRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/Projects",
        element: <div>Thisisthe other page</div>,
        children: [
          {
            path: "/Projects/flightscraper",
            element: <div>more info coming soon</div>,
          },
        ],
      },

      {
        path: "/CV",
        element: <CVPage />,
      },
      {
        path: "/Interests",
        element: <div>howziiiitt</div>,
      },
    ],
  },
]);
ReactDOM.createRoot(elRoot).render(
  <React.StrictMode>
    <RouterProvider router={router} />
    {isLanding ? <LandingPage sectionId={RootPath} /> : null}
  </React.StrictMode>
);
