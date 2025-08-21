import { Link, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"

export function Header() {
  const [email, setEmail] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession()
      setEmail(data.session?.user.email ?? null)

      const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
        setEmail(session?.user.email ?? null)
      })
      return () => sub.subscription.unsubscribe()
    }
    init()
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
    navigate("/")
  }

  return (
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-farm-dark">Fresh<span className="text-farm-green">Farm</span></Link>
        <nav className="flex items-center gap-4">
          <Link to="/pricing" className="text-gray-700 hover:text-farm-dark">Pricing</Link>
          {email ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">{email}</span>
              <button onClick={signOut} className="btn btn-outline">Sign out</button>
            </div>
          ) : (
            <Link to="/auth" className="btn btn-primary">Sign in</Link>
          )}
        </nav>
      </div>
    </header>
  )
}
