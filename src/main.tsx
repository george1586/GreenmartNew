import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Home } from './pages/Home'
import { Pricing } from './pages/Pricing'
import { Auth } from './pages/Auth'
import { ThankYou } from './pages/ThankYou'
import { Cancel } from './pages/Cancel'

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/pricing", element: <Pricing /> },
  { path: "/auth", element: <Auth /> },
  { path: "/thank-you", element: <ThankYou /> },
  { path: "/cancel", element: <Cancel /> },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
