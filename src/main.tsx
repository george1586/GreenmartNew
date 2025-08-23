import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Home } from './pages/Home'
import { Auth } from './pages/Auth'
import { ThankYou } from './pages/ThankYou'
import { Cancel } from './pages/Cancel'
import { Helmet } from 'react-helmet';

// For SEO in React apps, consider using server-side rendering (SSR) frameworks like Next.js or Remix.
// With client-side React (like this), SEO is limited because content is rendered after JS loads.
// You can improve SEO by setting meta tags dynamically using react-helmet:

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <Helmet>
          <title>GreenMart</title>
          <meta name="description" content="GreenMart - Cumpără produse proaspete direct de la fermieri locali. Piață online cu legume, fructe, lactate, carne și produse naturale. Susține agricultura locală!" />
          <meta name="keywords" content="GreenMart, produse fermieri locali, piață online, legume proaspete, fructe proaspete, produse naturale, agricultură locală, fermieri români, cumpără local" />
          <meta property="og:title" content="GreenMart - Produse fermieri locali" />
          <meta property="og:description" content="Descoperă GreenMart: sursa ta pentru produse proaspete de la fermieri locali. Comandă online legume, fructe și alte produse naturale." />
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://greenmart.ro/" />
          <meta property="og:image" content="https://greenmart.ro/og-image.jpg" />
          <link rel="canonical" href="https://greenmart.ro/" />
          <link rel="icon" href="https://hasxcndrhvtyjphntpft.supabase.co/storage/v1/object/public/images/leaf.png" type="image/x-icon" />
          <html lang="ro" />
        </Helmet>
        <Home />
      </>
    )
  },
  {
    path: "/auth",
    element: (
      <>
        <Helmet>
          <title>Login - Greenmart</title>
          <meta name="description" content="Autentifică-te în contul tău GreenMart pentru a cumpăra produse proaspete de la fermieri locali." />
          <meta name="keywords" content="GreenMart autentificare, login, cont client, produse fermieri locali" />
          <link rel="canonical" href="https://greenmart.ro/auth" />
          <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        </Helmet>
        <Auth />
      </>
    )
  },
  {
    path: "/thank-you",
    element: (
      <>
        <Helmet>
          <title>Mulțumim pentru comandă - Greenmart</title>
          <meta name="description" content="Mulțumim pentru comanda ta la GreenMart. Bucură-te de produse proaspete de la fermieri locali!" />
          <meta name="keywords" content="GreenMart, mulțumim, comandă, produse fermieri locali" />
          <link rel="canonical" href="https://greenmart.ro/thank-you" />
          <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        </Helmet>
        <ThankYou />
      </>
    )
  },
  {
    path: "/cancel",
    element: (
      <>
        <Helmet>
          <title>Comandă anulată - Greenmart</title>
          <meta name="description" content="Comanda ta a fost anulată. Descoperă alte produse proaspete de la fermieri locali pe GreenMart." />
          <meta name="keywords" content="GreenMart, comandă anulată, produse fermieri locali" />
          <link rel="canonical" href="https://greenmart.ro/cancel" />
          <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        </Helmet>
        <Cancel />
      </>
    )
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
