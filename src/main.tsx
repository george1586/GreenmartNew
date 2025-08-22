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
          <title>Acasă - GreenMart</title>
          <meta name="description" content="Bine ai venit la GreenMart, sursa ta pentru produse proaspete." />
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
          <title>Login - GreenMart</title>
          <meta name="description" content="Login to your GreenMart account." />
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
          <title>Thank You - GreenMart</title>
          <meta name="description" content="Mulțumim pentru comanda ta la GreenMart." />
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
          <title>Order Cancelled - GreenMart</title>
          <meta name="description" content="Comanda ta a fost anulată." />
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
