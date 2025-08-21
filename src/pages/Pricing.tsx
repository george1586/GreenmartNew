import { Header } from "../components/Header"
import { CheckoutButton } from "../components/CheckoutButton"
import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"

export function Pricing() {
  const [email, setEmail] = useState<string | null>(null)
  useEffect(()=>{
    supabase.auth.getSession().then(({data})=> setEmail(data.session?.user.email ?? null))
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s)=> setEmail(s?.user.email ?? null))
    return ()=>sub.subscription.unsubscribe()
  }, [])

  const plans = [
    {
      name: "Basic Box",
      desc: "Perfect for 1–2 people. Weekly seasonal selection.",
      price: "29.99",
      priceId: import.meta.env.VITE_STRIPE_PRICE_BASIC as string,
      features: ["~6–8 items", "Local farms", "Skip or cancel anytime"],
    },
    {
      name: "Pro Box",
      desc: "For families or foodies. Bigger variety & portions.",
      price: "49.99",
      priceId: import.meta.env.VITE_STRIPE_PRICE_PRO as string,
      features: ["~10–12 items", "Priority selection", "Skip or cancel anytime"],
      highlight: true,
    },
  ]

  return (
    <>
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-extrabold text-farm-dark text-center mb-10">Choose your plan</h1>
        <div className="grid md:grid-cols-2 gap-6">
          {plans.map((p) => (
            <div key={p.name} className={`card p-8 ${p.highlight ? "ring-2 ring-farm-green" : ""}`}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-2xl font-bold text-farm-dark">{p.name}</h3>
                {p.highlight && <span className="text-xs bg-farm-light text-farm-dark py-1 px-2 rounded-full">Popular</span>}
              </div>
              <p className="text-gray-600 mb-4">{p.desc}</p>
              <div className="text-4xl font-extrabold text-farm-dark mb-6">${p.price}<span className="text-base text-gray-500">/box</span></div>
              <ul className="space-y-2 mb-6">
                {p.features.map((f,i) => <li key={i} className="text-gray-700">• {f}</li>)}
              </ul>
              <CheckoutButton priceId={p.priceId} customerEmail={email} label={`Choose ${p.name}`} />
            </div>
          ))}
        </div>
      </main>
    </>
  )
}
