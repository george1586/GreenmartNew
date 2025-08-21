import { Link } from "react-router-dom"
import { Header } from "../components/Header"
import { CheckoutButton } from "../components/CheckoutButton"
import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"

const priceBasic = import.meta.env.VITE_STRIPE_PRICE_BASIC as string
const pricePro = import.meta.env.VITE_STRIPE_PRICE_PRO as string

export function Home() {
  const [email, setEmail] = useState<string | null>(null)
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setEmail(data.session?.user.email ?? null))
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setEmail(s?.user.email ?? null))
    return () => sub.subscription.unsubscribe()
  }, [])

  return (
    <>
      <Header />
      <main className="bg-gradient-to-b from-white to-farm-light">
        {/* HERO */}
        <section className="max-w-6xl mx-auto px-4 pt-14 pb-10 lg:pt-20">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-farm-light text-farm-dark rounded-full px-3 py-1 text-xs mb-4">
                🥕 Sustenabil • Local • Super proaspăt
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-farm-dark">
                Cutii cu legume proaspete <span className="text-farm-green">livrate săptămânal</span>
              </h1>
              <p className="text-gray-700 mt-4 text-lg">
                Alege pachetul potrivit și primești legume de sezon, culese din ferme locale, direct la ușa ta.
              </p>
              {/* Trust row */}
              <div className="flex flex-wrap items-center gap-4 mt-5 text-sm text-gray-600">
                <div className="flex items-center gap-2"><span>✅</span> Garanție prospețime</div>
                <div className="flex items-center gap-2"><span>🔒</span> Plată sigură cu Stripe</div>
                <div className="flex items-center gap-2"><span>⏱️</span> 2 minute să te abonezi</div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-7">
                <a href="#pricing" className="btn btn-primary text-base">Începe acum</a>
                <Link to="/pricing" className="btn btn-outline text-base">Vezi pachetele</Link>
              </div>

              {/* Social proof micro */}
              <p className="text-xs text-gray-500 mt-4">
                Peste <b>2,300</b> de cutii livrate • Rating mediu <b>4.9/5</b>
              </p>
            </div>

            <div className="card p-0 overflow-hidden">
              <img
                alt="Cutie cu legume proaspete"
                className="w-full h-full object-cover"
                src="https://images.unsplash.com/photo-1607305387292-96c23a65a3f6?q=80&w=1600&auto=format&fit=crop"
              />
            </div>
          </div>
        </section>

        {/* WHY / BENEFITS */}
        <section className="max-w-6xl mx-auto px-4 py-10">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { t: "Gust autentic", d: "Legume de sezon, culese la maturitate din ferme locale." },
              { t: "Zero bătăi de cap", d: "Alegi pachetul o dată, noi livrăm recurent." },
              { t: "Mai sănătos", d: "Proaspăt, variat și echilibrat pentru toată familia." },
            ].map((b, i) => (
              <div key={i} className="card p-6">
                <h3 className="text-xl font-bold text-farm-dark mb-2">{b.t}</h3>
                <p className="text-gray-600">{b.d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* PRICING INLINE */}
        <section id="pricing" className="max-w-6xl mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-extrabold text-farm-dark">Alege pachetul</h2>
            <p className="text-gray-600 mt-2">Fără obligații pe termen lung. Poți întrerupe oricând.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* BASIC */}
            <div className="card p-8">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-farm-dark">Basic Box</h3>
                <span className="text-xs bg-farm-light text-farm-dark py-1 px-2 rounded-full">Cel mai iubit</span>
              </div>
              <p className="text-gray-600 mt-1">Pentru 1–2 persoane • selecție săptămânală</p>
              <div className="mt-5 text-4xl font-extrabold text-farm-dark">
                29,99<span className="text-base text-gray-500"> €/săpt</span>
              </div>
              <ul className="mt-5 space-y-2 text-gray-700">
                <li>• ~6–8 produse de sezon</li>
                <li>• Fermieri locali verificați</li>
                <li>• Pachet flexibil (pauză oricând)</li>
              </ul>
              <div className="mt-6">
                <CheckoutButton
                  priceId={priceBasic}
                  customerEmail={email}
                  label="Începe cu Basic"
                  mode="subscription"
                />
                <p className="text-xs text-gray-500 mt-2">Anulezi oricând, fără costuri ascunse.</p>
              </div>
            </div>

            {/* PRO */}
            <div className="card p-8 ring-2 ring-farm-green">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-farm-dark">Pro Box</h3>
                <span className="text-xs bg-farm-green text-white py-1 px-2 rounded-full">Recomandat</span>
              </div>
              <p className="text-gray-600 mt-1">Pentru familii • varietate și porții mai mari</p>
              <div className="mt-5 text-4xl font-extrabold text-farm-dark">
                49,99<span className="text-base text-gray-500"> €/săpt</span>
              </div>
              <ul className="mt-5 space-y-2 text-gray-700">
                <li>• ~10–12 produse premium</li>
                <li>• Selecție prioritară</li>
                <li>• Pachet flexibil (pauză oricând)</li>
              </ul>
              <div className="mt-6">
                <CheckoutButton
                  priceId={pricePro}
                  customerEmail={email}
                  label="Alege Pro"
                  mode="subscription"
                />
                <p className="text-xs text-gray-500 mt-2">Livrare inclusă în multe zone urbane.</p>
              </div>
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-8 text-sm text-gray-600">
            <div className="flex items-center gap-2"><span>🔁</span> Pauză/Anulare dintr-un click</div>
            <div className="flex items-center gap-2"><span>🌱</span> Ambalaje prietenoase cu mediul</div>
            <div className="flex items-center gap-2"><span>💬</span> Suport rapid pe email</div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="max-w-6xl mx-auto px-4 py-10">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { n: "Mara D.", t: "Cutia Basic ne ajunge perfect pentru săptămână. Totul foarte gustos." },
              { n: "Andrei P.", t: "Fără stres: vin mereu produse proaspete. Recomand Pro pentru varietate." },
              { n: "Ioana R.", t: "Îmi place că pot pune pauză când sunt plecată. Experiență excelentă." },
            ].map((c, i) => (
              <div key={i} className="card p-6">
                <p className="text-gray-700">“{c.t}”</p>
                <p className="mt-3 text-sm text-gray-500">— {c.n}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="max-w-4xl mx-auto px-4 py-10">
          <h3 className="text-2xl font-extrabold text-farm-dark mb-4 text-center">Întrebări frecvente</h3>
          <div className="space-y-4">
            <details className="card p-5">
              <summary className="cursor-pointer font-semibold text-farm-dark">Pot anula oricând?</summary>
              <p className="text-gray-600 mt-2">Da. Abonamentul este flexibil și poți pune pauză sau anula oricând.</p>
            </details>
            <details className="card p-5">
              <summary className="cursor-pointer font-semibold text-farm-dark">Ce metode de plată acceptați?</summary>
              <p className="text-gray-600 mt-2">Plăți securizate prin Stripe (carduri principale, Apple/Google Pay unde e disponibil).</p>
            </details>
            <details className="card p-5">
              <summary className="cursor-pointer font-semibold text-farm-dark">Livrați în zona mea?</summary>
              <p className="text-gray-600 mt-2">Acoperim principalele orașe. La checkout introduci adresa și verifici rapid.</p>
            </details>
          </div>

          <div className="text-center mt-8">
            <a href="#pricing" className="btn btn-primary text-base">Începe astăzi</a>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="border-t">
          <div className="max-w-6xl mx-auto px-4 py-10 text-sm text-gray-600 flex flex-col md:flex-row gap-3 items-center justify-between">
            <div>© {new Date().getFullYear()} FreshFarm</div>
            <div className="flex gap-4">
              <a href="#" className="hover:text-farm-dark">Termeni</a>
              <a href="#" className="hover:text-farm-dark">Confidențialitate</a>
              <a href="#" className="hover:text-farm-dark">Contact</a>
            </div>
          </div>
        </footer>
      </main>

      {/* Sticky mobile CTA */}
      <div className="fixed bottom-4 inset-x-4 md:hidden">
        <a href="#pricing" className="btn btn-primary w-full shadow-lg">Alege pachetul</a>
      </div>
    </>
  )
}
