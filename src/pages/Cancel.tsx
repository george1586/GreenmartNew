import { Header } from "../components/Header"
import { Link } from "react-router-dom"

export function Cancel() {
  return (
    <>
      <Header />
      <main className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="card p-10">
          <h1 className="text-3xl font-extrabold text-farm-dark mb-3">Payment cancelled</h1>
        </div>
        <div className="text-center mt-6">
          <Link to="/pricing" className="btn btn-outline">Try again</Link>
        </div>
      </main>
    </>
  )
}
