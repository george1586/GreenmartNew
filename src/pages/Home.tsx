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
                {/* subtle dark overlay for readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/30" />
              </div>

              <div className="max-w-6xl mx-auto px-4 pt-8 pb-10 lg:pt-28 lg:pb-24 relative z-10">
                <div className="grid lg:grid-cols-2 gap-10 items-center">
                  <FadeIn y={20}>
                    <div className="text-white">
                      <h1 className="text-4xl md:text-5xl font-extrabold leading-tight drop-shadow-lg">
                        Piața online a fermierilor{' '}
                        <span className="font-extrabold drop-shadow-md">care livrează direct la ușa ta</span>
                      </h1>
                      {/* <p className="mt-4 text-lg text-white/95 drop-shadow-sm">
                      Primești săptămânal un mix de legume locale, fructe și produse artizanale. Gătești rapid, mănânci
                      echilibrat și susții fermierii din România mai accesibil și ușor decât a fost vreodată.
                    </p> */}
                      <Stagger delay={0.2}>
                        {/* <ItemUp>
                        <div className="flex flex-wrap items-center gap-4 mt-5 text-sm text-white/90 drop-shadow-sm">
                          <div className="flex items-center gap-2"><span>✅</span> Garanție prospețime</div>
                          <div className="flex items-center gap-2"><span>⏱️</span> 2 minute să te abonezi</div>
                        </div>
                      </ItemUp> */}
                        <ItemUp>
                          <div className="flex flex-col items-start mt-8">
                            <MotionButton className="btn btn-primary w-[240px] h-[52px] text-lg font-bold flex items-center justify-center">
                              <Link
                                to='/get-started'>
                                <a className="text-white block font-bold">Începe acum</a>
                              </Link>
                            </MotionButton>
                            <p className="text-sm text-white/80 mt-3">Livrăm produse locale de sezon direct de la fermieri.</p>
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
                    className="card p-0 overflow-hidden will-change-transform h-[320px] md:h-[420px] lg:h-[500px] flex items-center"
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
                      <p className="text-farm-green/90 mt-2 text-lg">
                        Transformă-ți bucătăria într-un centru al prospețimii și sănătății
                      </p>
                    </ItemUp>

                    <div className="mt-6 space-y-3 text-gray-700">
                      {[
                        "Între 22 și 25 kg de legume, fructe și produse artizanale livrate direct la ușa ta lunar, în funcție de disponibilitate",
                        "Primești în fiecare sâmbătă legume proaspete și produse artizanale direct de la mici producători locali verificați",
                        "Nu plătești pentru o etichetă, plătești pentru calitate",
                        "Te bucuri de alimente naturale, gustoase și hrănitoare pentru tine și familia ta",
                        "Timpul pierdut la cumpărături este transformat în timp pentru lucrurile care chiar contează",
                        "Contribui activ la reducerea risipei alimentare și a poluării",
                        "Sprijini fermierii locali și faci parte dintr-o comunitate sustenabilă",
                      ].map((line, i) => (
                        <ItemUp key={i}>
                          <div className="flex items-start gap-3">
                            <span className="mt-0.5 text-farm-green">✓</span>
                            <p>{line}</p>
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
                    <HoverCard className="card p-6 h-full">
                      <h3 className="text-xl font-bold text-farm-dark mb-2">{b.t}</h3>
                      <p className="text-gray-600">{b.d}</p>
                    </HoverCard>
                  </ItemUp>
                ))}
              </div>
            </Stagger>
          </section>
          <div className="flex justify-center items-center pb-8">
            <div>
              <FadeIn>
                <div className="card mt-10 p-6 md:p-8 text-center">
                  <p className="text-lg font-semibold text-farm-dark">E atât de simplu</p>
                  <p className="text-gray-600 mt-1">
                    Comanzi online, noi ne ocupăm de restul. Fără drumuri, fără griji – doar bunătăți, săptămână de săptămână.
                  </p>
                  <p className="text-farm-dark mt-4 font-bold">Pregătit să mănânci mai sănătos?</p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-4">
                    <Link
                      to='/get-started'>
                      <a className="text-white btn btn-primary font-bold">Începe acum</a>
                    </Link>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>


          {/* HOW IT WORKS */}
          <section id="how-it-works" className="bg-white/60">
            <div className="max-w-6xl mx-auto px-4 py-12">
              <FadeIn>
                <div className="text-center max-w-3xl mx-auto">
                  <span className="inline-flex items-center gap-2 bg-farm-light text-farm-dark rounded-full px-3 py-1 text-xs">
                    E atât de simplu
                  </span>
                  <h2 className="text-3xl md:text-4xl font-extrabold text-farm-dark mt-3">Cum funcționează</h2>
                  <p className="text-gray-700 mt-2">Abonează-te la stilul tău de viață sănătos.</p>
                </div>
              </FadeIn>

              <Stagger gap={0.1}>
                <div className="grid md:grid-cols-4 gap-6 mt-10 auto-rows-fr">
                  {[
                    { i: 1, emoji: "🧺", t: "Alege box-ul preferat", d: "Toate conțin legume,fructe și/sau produse artizanale de sezon. Diferența o face cantitatea și diversitatea de care ai nevoie." },
                    { i: 2, emoji: "🚚", t: "În tranzit", d: "Pregătim comanda în fiecare sâmbătă dimineața. Selecție, împachetare, prospețime – le rezolvăm noi." },
                    { i: 3, emoji: "🏠", t: "Ajunge la tine", d: "Livrăm cu grijă la ușă. Fără cozi, fără trafic, fără stres." },
                    { i: 4, emoji: "🥗", t: "Gătești. Mănânci. Te simți bine.", d: "Proaspăt, fără risipă și cu impact real asupra sănătății tale și a comunității." },
                  ].map((step) => (
                    <ItemUp key={step.i}>
                      <HoverCard className="card p-6 h-full">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-9 h-9 rounded-full bg-farm-green/10 text-farm-green grid place-items-center font-bold">
                            {step.i}
                          </div>
                          <span className="text-2xl">{step.emoji}</span>
                        </div>
                        <h3 className="text-lg font-bold text-farm-dark">{step.t}</h3>
                        <p className="text-gray-600 mt-2">{step.d}</p>
                      </HoverCard>
                    </ItemUp>
                  ))}
                </div>
              </Stagger>
            </div>
          </section>

          {/* PRICING — all offers on ONE ROW at lg, with mini-calendar under each */}
          <section id="pricing" className="max-w-6xl mx-auto px-4 py-14 scroll-mt-24">
            <FadeIn>
              <div className="text-center mb-10">
                <span className="inline-flex items-center gap-2 bg-farm-light text-farm-dark rounded-full px-3 py-1 text-xs">
                  <Sparkles className="h-3.5 w-3.5" /> Abonamente flexibile
                </span>
                <h2 className="text-3xl md:text-4xl font-extrabold text-farm-dark mt-3">Alege pachetul perfect</h2>
                <p className="text-gray-600 mt-2">Fără obligații pe termen lung. Poți întrerupe oricând, din contul tău.</p>
              </div>
            </FadeIn>


            <FadeIn delay={0.1}>
              <div className="flex flex-wrap items-center justify-center gap-4 mt-10 text-sm text-gray-600">
                <div className="flex items-center gap-2"><span>🔁</span> Anulare dintr-un click</div>
                <div className="flex items-center gap-2"><span>🚚</span> Livrare gratuită</div>
                <div className="flex items-center gap-2"><span>🌱</span> Prospețime garantată</div>
                <div className="flex items-center gap-2"><span>📦</span> 4 livrări/lună</div>
              </div>
            </FadeIn>
          </section >

          {/* TESTIMONIALS — nume sus + stele */}
          < section className="max-w-6xl mx-auto px-4 py-10" >
            <Stagger>
              <div className="grid md:grid-cols-3 gap-6 auto-rows-fr">
                {[
                  { n: "Mara D.", t: "Cutia Green ne ajunge perfect pentru săptămână. Totul foarte gustos.", r: 5 },
                  { n: "Andrei P.", t: "Fără stres: vin mereu produse proaspete. Recomand Pro pentru varietate.", r: 5 },
                  { n: "Ioana R.", t: "Îmi place că este mai mult decât o experiență, este un lifestyle.", r: 5 },
                ].map((c, i) => (
                  <ItemUp key={i}>
                    <HoverCard className="card p-6 h-full">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-semibold text-farm-dark">{c.n}</p>
                        <div className="flex items-center gap-0.5" aria-label={`${c.r} stele`}>
                          {Array.from({ length: 5 }).map((_, idx) => (
                            <Star
                              key={idx}
                              className="h-4 w-4 text-amber-500"
                              fill={idx < c.r ? "currentColor" : "none"}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700">“{c.t}”</p>
                    </HoverCard>
                  </ItemUp>
                ))}
              </div>
            </Stagger>
          </section >

          {/* FAQ */}
          < section className="max-w-4xl mx-auto px-4 py-10" >
            <FadeIn>
              <h3 className="text-2xl font-extrabold text-farm-dark mb-4 text-center">Întrebări frecvente</h3>
            </FadeIn>
            <Stagger>
              <div className="space-y-4">
                {[
                  {
                    q: "Care sunt beneficiile de a comanda de la noi?",
                    a: (
                      <>
                        Beneficiezi mereu de o surpriză și varietate, nu mai pierzi timp în magazin, livrare la ușă și suport dedicat.
                        Produsele sunt proaspete și de calitate superioară. Află mai multe pe acest{" "}
                        <a href="/produse-locale" className="text-farm-green">link</a>.
                      </>
                    ),
                  },
                  {
                    q: "Cât de sigur este să comanzi de la producători locali?",
                    a: (
                      <>
                        Colaborăm doar cu producători locali de încredere, care respectă standardele de siguranță alimentară.
                        Vezi detalii <a href="/producatori" className="text-farm-green">aici</a>.
                      </>
                    ),
                  },
                  { q: "Pot alege produsele din box?", a: "Nu, din cauza numărului mare de comenzi, produsele sunt preselectate în funcție de sezon și disponibilitate, este ceva ce am vrea să implementăm în viitor dar acum ne putem asigura doar că boxurile sunt cât se poate posibil de diverse." },
                  { q: "Pot anula abonamentul?", a: "Da. Abonamentul este lunar și poți anula din contul tău după fiecare lună." },
                  { q: "Livrați în zona mea?", a: "În momentul de față livrăm doar în Timișoara; urmărim extinderea." },
                ].map(({ q, a }, i) => (
                  <ItemUp key={i}>
                    <details className="card p-5">
                      <summary className="cursor-pointer font-semibold text-farm-dark">{q}</summary>
                      <p className="text-gray-600 mt-2">{a}</p>
                    </details>
                  </ItemUp>
                ))}
              </div>
            </Stagger>

            <FadeIn delay={0.1}>
              <div className="text-center mt-8">
                <Link
                  to='/get-started'>
                  <a href="#pricing" className="btn btn-primary text-base">Începe astăzi</a>
                </Link>
              </div>
            </FadeIn>
          </section >

          {/* FOOTER */}
          <Footer></Footer>
        </main >
      </div>
    </>
  );
}
