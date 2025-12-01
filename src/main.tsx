// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Home } from "./pages/Home";
import { Auth } from "./pages/Auth";
import { ThankYou } from "./pages/ThankYou";
import { Cancel } from "./pages/Cancel";
import { TermsAndConditions } from "./pages/TermsAndConditions";
import { Confidentialitate } from "./pages/Confidentialitate";
import Subscriptions from "./pages/Subscriptions";
import { HelmetProvider } from "react-helmet-async";
import { Analytics } from "@vercel/analytics/react";
import { LocalProducts } from "./pages/LocalProducts";
import { Producers } from "./pages/Producers";
import { GetStarted } from "./pages/GetStarted";
import { Plans } from "./pages/Plans";
import { DeliveryAndSize } from "./pages/DeliveryAndSize";

// Router config
const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/auth", element: <Auth /> },
  { path: "/thank-you", element: <ThankYou /> },
  { path: "/cancel", element: <Cancel /> },
  { path: "/termeni", element: <TermsAndConditions /> },
  { path: "/confidentialitate", element: <Confidentialitate /> },
  { path: "/subscriptii", element: <Subscriptions /> },
  { path: "/producatori", element: <Producers /> },
  { path: "/produse-locale", element: <LocalProducts /> },
  { path: "/get-started", element: <GetStarted /> },
  { path: "/plans", element: <Plans /> },
  { path: "/delivery-and-size", element: <DeliveryAndSize /> }
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HelmetProvider>
      <RouterProvider router={router} />
      <Analytics />
    </HelmetProvider>
  </React.StrictMode>
);
