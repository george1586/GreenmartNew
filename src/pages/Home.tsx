// src/pages/Home.tsx
import { Link } from "react-router-dom";
import { Header } from "../components/Header";
import { CheckoutButton } from "../components/CheckoutButton";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import {
  FadeIn,
  Stagger,
  ItemUp,
  HoverCard,
  MotionButton,
  Motion,
} from "../components/motion";
import { Button } from "../components/ui/Button";
import { Star, CheckCircle2, Crown, Sparkles } from "lucide-react";
import { useLocation } from "react-router-dom";
import { Footer } from "../components/Footer";

/* ====== Stripe Price IDs ====== */
const priceBasic = import.meta.env.VITE_STRIPE_PRICE_BASIC as string;      // Green Box Mic
const pricePro = import.meta.env.VITE_STRIPE_PRICE_PRO as string;          // Green Box Mare
const priceProMic = import.meta.env.VITE_STRIPE_PRICE_PRO_MIC as string;   // Pro Box Mic
const priceProMare = import.meta.env.VITE_STRIPE_PRICE_PRO_MARE as string; // Pro Box Mare

export function Home() {
  const [email, setEmail] = useState<string | null>(null);
  const location = useLocation();
  function targetAnchor(): string | null {
    const params = new URLSearchParams(window.location.search);
    if (params.get("goto") === "pricing") return "#pricing";
    const h = window.location.hash.replace(/^#/, "");
    if (h.startsWith("pricing")) return "#pricing";
    return null;
  }
  useEffect(() => {
    const hash = window.location.hash;
    const hasSupabaseTokens =
      hash.includes("access_token=") ||
      hash.includes("refresh_token=") ||
      hash.includes("type=signup") ||
      hash.includes("type=recovery");
    if (hasSupabaseTokens) {
      const url = new URL(window.location.href);
      const anchor = targetAnchor() ?? "";
      window.history.replaceState({}, "", `${url.origin}${url.pathname}${url.search}${anchor}`);
    }
  }, [location.hash, location.search]);
  useEffect(() => {
    const anchor = targetAnchor();
    if (!anchor) return;
    const el = document.querySelector(anchor);
    if (!el) return;
    requestAnimationFrame(() => {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [location.hash, location.search]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setEmail(data.session?.user.email ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setEmail(s?.user.email ?? null));
    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <>
      <div className="relative">
        <Header />

        <main className="relative bg-gradient-to-b from-white to-farm-light">
          {/* HERO - full cover image with text layered on top */}
          <section className="relative -mt-16">
            <div className="relative w-full min-h-dvh lg:min-h-screen overflow-hidden pt-32">
              {/* Background image */}
              <div className="absolute inset-0 z-0">
                <img
                  alt="Cutie cu legume proaspete"
                  className="w-full h-full object-cover"
                  src="https://hasxcndrhvtyjphntpft.supabase.co/storage/v1/object/public/images/hero-cover.png"
                />
                {/* overlays for text readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent z-0" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/20 z-0" />
              </div>

              <div className="max-w-6xl mx-auto px-4 pt-8 pb-10 lg:pt-28 lg:pb-24 relative z-10">
                <div className="grid lg:grid-cols-2 gap-10 items-center">
                  <FadeIn y={20}>
                    <div className="text-white">
                      <h1 className="text-4xl md:text-5xl font-extrabold leading-tight drop-shadow-2xl [text-shadow:_0_4px_12px_rgb(0_0_0_/_50%)] text-white">
                        Piața online a fermierilor{' '}
                        <span className="font-extrabold text-white drop-shadow-md">care livrează direct la ușa ta</span>
                      </h1>
                      <Stagger delay={0.2}>
                        <ItemUp>
                          <div className="flex flex-col items-start mt-8">
                             <Link to="/get-started">
                                <Button size="lg" className="h-[52px] text-lg px-8 shadow-xl border-2 border-white/20 hover:border-white/40">
                                    Începe acum
                                </Button>
                             </Link>
                            <p className="text-sm text-white/80 mt-3 drop-shadow-md font-medium">Livrăm produse locale de sezon direct de la fermieri.</p>
                          </div>
                        </ItemUp>
                        <ItemUp>
                          <p className="text-xs text-white/80 drop-shadow-sm mt-4">
                            Peste <b>300</b> de cutii livrate • Rating mediu <b>5/5</b>
                          </p>
                        </ItemUp>
                      </Stagger>
                    </div>
                  </FadeIn>

                  {/* empty column to keep spacing on wide screens */}
                  <div className="hidden lg:block" />
                </div>
              </div>
            </div>
          </section>

          {/* WHY CHOOSE */}
          <section id="why-choose" className="bg-white/70 py-12">
            <div className="max-w-6xl mx-auto px-4 py-12">
              <div className="grid lg:grid-cols-2 gap-10 items-center">
                <FadeIn delay={0.1}>
                  <Motion.div
                    className="rounded-2xl overflow-hidden shadow-2xl h-[320px] md:h-[420px] lg:h-[500px] flex items-center bg-gray-100"
                    whileHover={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  >
                    <img
                      alt="Cutie cu legume proaspete"
                      className="w-full h-full object-cover"
                      src="https://hasxcndrhvtyjphntpft.supabase.co/storage/v1/object/public/images/og-hero.jpeg"
                    />
                  </Motion.div>
                </FadeIn>

                <Stagger gap={0.08}>
                  <div id="info">
                    <ItemUp>
                      <h2 className="text-3xl md:text-4xl font-extrabold text-farm-dark">
                        De ce să alegi GreenMart?
                      </h2>
                    </ItemUp>
                    <ItemUp>
                      <p className="text-farm-green/90 mt-2 text-lg font-medium">
                        Transformă-ți bucătăria într-un centru al prospețimii și sănătății
                      </p>
                    </ItemUp>

                    <div className="mt-8 space-y-4 text-gray-700">
                      {[
                        "Între 22 și 25 kg de legume, fructe și produse artizanale livrate direct la ușa ta lunar",
                        "Primești în fiecare sâmbătă legume proaspete și produse artizanale direct de la mici producători",
                        "Nu plătești pentru o etichetă, plătești pentru calitate",
                        "Te bucuri de alimente naturale, gustoase și hrănitoare pentru tine și familia ta",
                        "Timpul pierdut la cumpărături este transformat în timp pentru lucrurile care chiar contează",
                        "Contribui activ la reducerea risipei alimentare și a poluării",
                        "Sprijini fermierii locali și faci parte dintr-o comunitate sustenabilă",
                      ].map((line, i) => (
                        <ItemUp key={i}>
                          <div className="flex items-start gap-3">
                            <div className="mt-1 bg-farm-green/10 p-1 rounded-full text-farm-green shrink-0">
                                <CheckCircle2 className="h-3 w-3" strokeWidth={3} />
                            </div>
                            <p className="leading-relaxed">{line}</p>
                          </div>
                        </ItemUp>
                      ))}
                    </div>
                  </div>
                </Stagger>
              </div>
            </div>
          </section>

          {/* BENEFITS */}
          <section className="max-w-6xl mx-auto px-4 py-10">
            <Stagger gap={0.12}>
              <div className="grid md:grid-cols-3 gap-6 auto-rows-fr">
                {[
                  { t: "Gust autentic", d: "Legume de sezon, culese la maturitate din ferme locale." },
                  { t: "Zero bătăi de cap", d: "Alegi pachetul o singură dată, noi livrăm recurent." },
                  { t: "Mai sănătos", d: "Proaspăt, variat și echilibrat pentru toată familia." },
                ].map((b, i) => (
                  <ItemUp key={i}>
                    <HoverCard className="bg-white rounded-2xl p-8 h-full shadow-sm border border-gray-100 hover:shadow-md transition-all">
                      <h3 className="text-xl font-bold text-farm-dark mb-2">{b.t}</h3>
                      <p className="text-gray-600 leading-relaxed">{b.d}</p>
                    </HoverCard>
                  </ItemUp>
                ))}
              </div>
            </Stagger>
          </section>

          <div className="flex justify-center items-center pb-8">
            <div className="max-w-2xl w-full px-4">
              <FadeIn>
                <div className="bg-white rounded-2xl mt-10 p-8 md:p-12 text-center shadow-xl border border-gray-100">
                  <p className="text-lg font-semibold text-farm-dark">E atât de simplu</p>
                  <p className="text-gray-600 mt-2">
                    Comanzi online, noi ne ocupăm de restul. Fără drumuri, fără griji – doar bunătăți, săptămână de săptămână.
                  </p>
                  <p className="text-farm-dark mt-6 font-bold text-xl">Pregătit să mănânci mai sănătos?</p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
                    <Link to="/get-started">
                        <Button size="lg" className="px-8 text-lg w-full sm:w-auto">
                            Începe acum
                        </Button>
                    </Link>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>


          {/* HOW IT WORKS */}
          <section id="how-it-works" className="bg-farm-light/30 py-20">
            <div className="max-w-6xl mx-auto px-4">
              <FadeIn>
                <div className="text-center max-w-3xl mx-auto mb-16">
                  <span className="inline-flex items-center gap-2 bg-white text-farm-dark border border-gray-200 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider">
                    Pașii simpli
                  </span>
                  <h2 className="text-3xl md:text-4xl font-extrabold text-farm-dark mt-4">Cum funcționează</h2>
                  <p className="text-lg text-gray-600 mt-4 leading-relaxed">Abonează-te la stilul tău de viață sănătos în câteva minute.</p>
                </div>
              </FadeIn>

              <Stagger gap={0.1}>
                <div className="grid md:grid-cols-4 gap-6">
                  {[
                    { i: 1, emoji: "🧺", t: "Alege box-ul", d: "Legume, fructe și produse artizanale. Tu alegi cantitatea." },
                    { i: 2, emoji: "🚚", t: "În tranzit", d: "Pregătim comanda sâmbăta. Prospețime garantată." },
                    { i: 3, emoji: "🏠", t: "Ajunge la tine", d: "Livrăm cu grijă la ușă. Fără trafic, fără stres." },
                    { i: 4, emoji: "🥗", t: "Te bucuri", d: "Gătești proaspăt, mănânci sănătos, te simți bine." },
                  ].map((step) => (
                    <ItemUp key={step.i}>
                      <HoverCard className="bg-white rounded-2xl p-6 h-full shadow-sm border border-gray-100 hover:shadow-md transition-all">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-full bg-farm-green text-white grid place-items-center font-bold text-lg">
                            {step.i}
                          </div>
                          <span className="text-3xl">{step.emoji}</span>
                        </div>
                        <h3 className="text-lg font-bold text-farm-dark">{step.t}</h3>
                        <p className="text-gray-600 mt-2 text-sm leading-relaxed">{step.d}</p>
                      </HoverCard>
                    </ItemUp>
                  ))}
                </div>
              </Stagger>
            </div>
          </section>

          {/* PRICING */}
          <section id="pricing" className="max-w-6xl mx-auto px-4 py-20 scroll-mt-24">
            <FadeIn>
              <div className="text-center mb-12">
                <span className="inline-flex items-center gap-2 bg-farm-green/10 text-farm-green rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="h-3.5 w-3.5" /> Abonamente flexibile
                </span>
                <h2 className="text-3xl md:text-4xl font-extrabold text-farm-dark mt-4">Alege pachetul perfect</h2>
                <p className="text-lg text-gray-600 mt-4">Fără obligații. Poți întrerupe oricând.</p>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
               <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl max-w-4xl mx-auto text-center">
                    <h3 className="text-2xl font-bold text-farm-dark mb-4">Gata să începi?</h3>
                    <p className="text-gray-600 mb-8">Configurează-ți cutia ideală în câțiva pași simpli.</p>
                    <Link to="/get-started">
                        <Button size="lg" className="px-10 text-lg shadow-lg shadow-farm-green/20">
                            Configurează Abonamentul
                        </Button>
                    </Link>
                    
                    <div className="flex flex-wrap items-center justify-center gap-6 mt-10 text-sm font-medium text-gray-500">
                        <div className="flex items-center gap-2"><span className="text-xl">🔁</span> Anulare oricând</div>
                        <div className="flex items-center gap-2"><span className="text-xl">🚚</span> Livrare inclusă</div>
                        <div className="flex items-center gap-2"><span className="text-xl">🌱</span> Local & Proaspăt</div>
                    </div>
               </div>
            </FadeIn>
          </section >

          {/* TESTIMONIALS */}
          < section className="max-w-6xl mx-auto px-4 py-16 bg-farm-light/20 rounded-3xl mb-16" >
            <Stagger>
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  { n: "Mara D.", t: "Cutia Green ne ajunge perfect pentru săptămână. Totul foarte gustos.", r: 5 },
                  { n: "Andrei P.", t: "Fără stres: vin mereu produse proaspete. Recomand Pro pentru varietate.", r: 5 },
                  { n: "Ioana R.", t: "Îmi place că este mai mult decât o experiență, este un lifestyle.", r: 5 },
                ].map((c, i) => (
                  <ItemUp key={i}>
                    <HoverCard className="bg-white p-8 h-full rounded-2xl shadow-sm border border-gray-100">
                      <div className="flex items-center justify-between mb-4">
                        <p className="font-bold text-farm-dark text-lg">{c.n}</p>
                        <div className="flex items-center gap-0.5" aria-label={`${c.r} stele`}>
                          {Array.from({ length: 5 }).map((_, idx) => (
                            <Star
                              key={idx}
                              className="h-4 w-4 text-amber-400"
                              fill={idx < c.r ? "currentColor" : "none"}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700 italic leading-relaxed">“{c.t}”</p>
                    </HoverCard>
                  </ItemUp>
                ))}
              </div>
            </Stagger>
          </section >

          {/* FAQ */}
          < section className="max-w-3xl mx-auto px-4 py-16" >
            <FadeIn>
              <h3 className="text-3xl font-extrabold text-farm-dark mb-10 text-center">Întrebări frecvente</h3>
            </FadeIn>
            <Stagger>
              <div className="space-y-4">
                {[
                  {
                    q: "Care sunt beneficiile de a comanda de la noi?",
                    a: "Beneficiezi mereu de o surpriză și varietate, nu mai pierzi timp în magazin, livrare la ușă și suport dedicat. Produsele sunt proaspete și de calitate superioară."
                  },
                  {
                    q: "Cât de sigur este să comanzi de la producători locali?",
                    a: "Colaborăm doar cu producători locali de încredere, care respectă standardele de siguranță alimentară."
                  },
                  { q: "Pot alege produsele din box?", a: "Nu, din cauza numărului mare de comenzi, produsele sunt preselectate în funcție de sezon și disponibilitate." },
                  { q: "Pot anula abonamentul?", a: "Da. Abonamentul este lunar și poți anula din contul tău după fiecare lună." },
                  { q: "Livrați în zona mea?", a: "În momentul de față livrăm doar în Timișoara; urmărim extinderea." },
                ].map(({ q, a }, i) => (
                  <ItemUp key={i}>
                    <details className="group bg-white rounded-2xl border border-gray-100 open:shadow-md transition-all duration-200">
                      <summary className="cursor-pointer font-bold text-farm-dark p-5 flex items-center justify-between select-none list-none">
                          {q}
                          <span className="transition delay-75 group-open:rotate-180">
                              <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10.6667 1.33334L6 6.00001L1.33333 1.33334" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                          </span>
                      </summary>
                      <div className="px-5 pb-5 pt-0 text-gray-600 leading-relaxed">
                        {a}
                      </div>
                    </details>
                  </ItemUp>
                ))}
              </div>
            </Stagger>

            <FadeIn delay={0.1}>
              <div className="text-center mt-12">
                 <Link to="/get-started">
                    <Button size="lg" className="px-10 text-lg">
                        Începe astăzi
                    </Button>
                </Link>
              </div>
            </FadeIn>
          </section >

          {/* FOOTER */}
          <Footer />
        </main >
      </div>
    </>

  );
}
