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
import { Analytics } from "@vercel/analytics/react";

// Router config
const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/auth", element: <Auth /> },
  { path: "/thank-you", element: <ThankYou /> },
  { path: "/cancel", element: <Cancel /> },
  { path: "/termeni", element: <TermsAndConditions /> },
  { path: "/confidentialitate", element: <Confidentialitate /> },
  { path: "/subscriptii", element: <Subscriptions /> },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
    <Analytics />
  </React.StrictMode>
);
