// src/main.tsx (sau index.tsx, cum îl ai)
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Home } from "./pages/Home";
import { Auth } from "./pages/Auth";
import { ThankYou } from "./pages/ThankYou";
import { Cancel } from "./pages/Cancel";
import { Helmet } from "react-helmet";
import { TermsAndConditions } from "./pages/TermsAndConditions";
import { Confidentialitate } from "./pages/Confidentialitate";
import { Analytics } from "@vercel/analytics/next"
import Subscriptions from "./pages/Subscriptions";
// === personalizează aici ===
const SITE_URL = "https://greenmart.ro";
const SITE_NAME = "Greenmart";
const SITE_DESC =
  "Greenmart – cutii cu legume, fructe și produse artizanale de la producători locali din Timișoara. Comandă online, proaspăt și sustenabil.";
// Logo (SVG/PNG minim 200×200) – pune URL-ul din Supabase Storage
const SITE_LOGO =
  "https://hasxcndrhvtyjphntpft.supabase.co/storage/v1/object/public/images/leaf.png";
// Imagine OG (1200×630 recomandat)
const OG_IMAGE =
  "https://hasxcndrhvtyjphntpft.supabase.co/storage/v1/object/public/images/leaf.png";
// ============================

function SEO({
  title,
  description,
  path = "/",
  ogImage = OG_IMAGE,
}: {
  title: string;
  description: string;
  path?: string;
  ogImage?: string;
}) {
  const url = `${SITE_URL}${path}`;
  const fullTitle = title ? `${title} – ${SITE_NAME}` : SITE_NAME;

  const jsonLdOrg = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: SITE_LOGO,
    sameAs: [],
  };

  const jsonLdWebsite = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <Helmet>
        <html lang="ro" />
        <title>{fullTitle}</title>
        <meta name="description" content={description} />
        <meta name="robots" content="index,follow" />
        <link rel="canonical" href={url} />
        <link rel="icon" href={SITE_LOGO} />

        {/* Open Graph */}
        <meta property="og:locale" content="ro_RO" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta property="og:title" content={fullTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={url} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:alt" content={`${SITE_NAME} – logo`} />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={fullTitle} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImage} />

        {/* PWA-ish niceties (opțional) */}
        <meta name="theme-color" content="#16a34a" />

        {/* JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify(jsonLdOrg)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(jsonLdWebsite)}
        </script>
      </Helmet>
    </>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <SEO
          title="Produse proaspete locale"
          description={SITE_DESC}
          path="/"
        />
        <Home />
      </>
    ),
  },
  {
    path: "/auth",
    element: (
      <>
        <SEO
          title="Autentificare"
          description="Autentifică-te în contul tău Greenmart pentru a comanda rapid cutiile tale preferate."
          path="/auth"
        />
        <Auth />
      </>
    ),
  },
  {
    path: "/thank-you",
    element: (
      <>
        <SEO
          title="Mulțumim pentru comandă"
          description="Mulțumim! Comanda ta Greenmart a fost înregistrată. Ne ocupăm să primești produse proaspete cât mai repede."
          path="/thank-you"
        />
        <ThankYou />
      </>
    ),
  },
  {
    path: "/cancel",
    element: (
      <>
        <SEO
          title="Comandă anulată"
          description="Comanda a fost anulată. Explorează produsele Greenmart și încearcă din nou când ești gata."
          path="/cancel"
        />
        <Cancel />
      </>
    ),
  },
  {
    path: "/termeni",
    element: (
      <>
        <SEO
          title="Termeni și condiții"
          description="Află mai multe despre termenii și condițiile serviciului Greenmart."
          path="/terms"
        />
        <TermsAndConditions />
      </>
    ),
  },
  {
    path: "/confidentialitate",
    element: (
      <>
        <SEO
          title="Află mai multe despre confidențialitate"
          description="Află mai multe despre politica de confidențialitate a serviciului Greenmart."
          path="/confidentialitate"
        />
        <Confidentialitate />
      </>
    ),
  },
  {
    path: "/subscriptii",
    element: (
      <>
        <SEO
          title="Menajează subscripții"
          description="Gestionează-ți abonamentele și preferințele de plată."
          path="/subscriptii"
        />
        <Subscriptions />
      </>
    ),
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
    <Analytics />
  </React.StrictMode>
);
