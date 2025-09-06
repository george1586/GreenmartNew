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
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { fbqPageView } from "./lib/fbq";

function UseMetaPageView() {
  const loc = useLocation();
  useEffect(() => {
    // wait for DOM updates, then fire
    requestAnimationFrame(() => fbqPageView());
  }, [loc.pathname, loc.search, loc.hash]);
  return null;
}

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
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HelmetProvider>
      <RouterProvider router={router} />
      <UseMetaPageView />
      <Analytics />
    </HelmetProvider>
  </React.StrictMode>
);
