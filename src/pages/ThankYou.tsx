import { Header } from "../components/Header"
import { useSearchParams, Link } from "react-router-dom"
import { useEffect } from "react";
import { fbqTrack } from "../lib/fbq";


export function ThankYou() {
  const [params] = useSearchParams()
  const sessionId = params.get("session_id")
  useEffect(() => {
    fbqTrack('Subscribe', { value: 299.00, currency: 'RON' });
  }, []);
  return (
    <>
      <Header />
      <main className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="card p-10">
          <h1 className="text-3xl font-extrabold text-farm-dark mb-3">Thank you! 🎉</h1>
          <p className="text-gray-700 mb-3">Your order was processed successfully.</p>
          {sessionId && <p className="text-xs text-gray-500">Session ID: {sessionId}</p>}
          <Link to="/" className="btn btn-primary mt-6">Back to home</Link>
        </div>
      </main>
    </>
  )
}
