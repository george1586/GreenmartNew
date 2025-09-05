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

/* ====== Stripe Price IDs ====== */
const priceBasic = import.meta.env.VITE_STRIPE_PRICE_BASIC as string;      // Green Box Mic
const pricePro = import.meta.env.VITE_STRIPE_PRICE_PRO as string;          // Green Box Mare
const priceProMic = import.meta.env.VITE_STRIPE_PRICE_PRO_MIC as string;   // Pro Box Mic
const priceProMare = import.meta.env.VITE_STRIPE_PRICE_PRO_MARE as string; // Pro Box Mare

/* ====== Calendar Component ====== */
function MonthProducts({ items }: { items: string[] }) {
  return (
    <div className="mt-6">
      <div className="text-xs font-medium text-gray-500 mb-2">
        Produse ce vor fi livrate în Octombrie
      </div>
      <ul className="grid grid-cols-2 gap-x-4 gap-y-1 text-[13px] text-gray-700 leading-snug">
        {items.map((it, i) => (
          <li key={i} className="flex gap-1">
            <span>•</span>
            <span>{it}</span>
          </li>
        ))}
      </ul>
      <p className="mt-2 text-[11px] text-gray-400">
        Produsele pot varia în funcție de sezonalitate și disponibilitate.
      </p>
    </div>
  );
}

export function Home() {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setEmail(data.session?.user.email ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setEmail(s?.user.email ?? null));
    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <>
      <Header />

      <main className="bg-gradient-to-b from-white to-farm-light">
        {/* HERO */}
        <section className="max-w-6xl mx-auto px-4 pt-14 pb-10 lg:pt-0 relative">
          <div className="grid lg:grid-cols-2 gap-10 items-center min-h-[70vh] lg:min-h-[80vh] py-0">
            <FadeIn y={20}>
              <div>
                <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-farm-dark">
                  Cutii cu produse locale, proaspete,{" "}
                  <span className="text-farm-green">livrate săptămânal, în fiecare sâmbătă</span>
                </h1>
                <p className="text-gray-700 mt-4 text-lg">
                  Primești săptămânal un mix de legume locale, fructe și produse artizanale. Gătești rapid, mănânci
                  echilibrat și susții fermierii din România mai accesibil și ușor decât a fost vreodată.
                </p>
                <Stagger delay={0.2}>
                  <ItemUp>
                    <div className="flex flex-wrap items-center gap-4 mt-5 text-sm text-gray-600">
                      <div className="flex items-center gap-2"><span>✅</span> Garanție prospețime</div>
                      <div className="flex items-center gap-2"><span>⏱️</span> 2 minute să te abonezi</div>
                    </div>
                  </ItemUp>
                  <ItemUp>
                    <div className="flex flex-col sm:flex-row gap-3 mt-7">
                      <MotionButton className="btn btn-primary text-base">
                        <a href="#pricing">Începe acum</a>
                      </MotionButton>
                      <MotionButton className="btn btn-outline text-base">
                        <a href="#info">Află mai multe</a>
                      </MotionButton>
                    </div>
                  </ItemUp>
                  <ItemUp>
                    <p className="text-xs text-gray-500 mt-4">
                      Peste <b>300</b> de cutii livrate • Rating mediu <b>5/5</b>
                    </p>
                  </ItemUp>
                </Stagger>
              </div>
            </FadeIn>

            {/* Imagine cu micro-interacțiune */}
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
          </div>
        </section>

        {/* WHY CHOOSE */}
        <section id="why-choose" className="bg-white/70">
          <div className="max-w-6xl mx-auto px-4 py-12">
            <div className="grid lg:grid-cols-2 gap-10 items-center">
              <FadeIn y={16}>
                <div className="rounded-3xl overflow-hidden shadow-sm ring-1 ring-black/5">
                  <img
                    src="https://hasxcndrhvtyjphntpft.supabase.co/storage/v1/object/public/images/family-cooking.jpg"
                    alt="Familie gătind cu legume proaspete"
                    className="w-full h-full object-cover"
                  />
                </div>
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

            <FadeIn>
              <div className="card mt-10 p-6 md:p-8 text-center">
                <p className="text-lg font-semibold text-farm-dark">E atât de simplu</p>
                <p className="text-gray-600 mt-1">
                  Comanzi online, noi ne ocupăm de restul. Fără drumuri, fără griji – doar bunătăți, săptămână de săptămână.
                </p>
                <p className="text-farm-dark mt-4 font-bold">Pregătit să mănânci mai sănătos?</p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-4">
                  <a href="#pricing" className="btn btn-primary">Începe acum</a>
                  <a href="#info" className="btn btn-outline">Află mai multe</a>
                </div>
              </div>
            </FadeIn>
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
                  { i: 1, emoji: "🧺", t: "Alege box-ul preferat", d: "Toate conțin legume și produse artizanale de sezon. Diferența o face cantitatea și diversitatea de care ai nevoie." },
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

          {/* 1 col (sm), 2 col (md), 4 col (lg). auto-rows-fr menține înălțimi egale. */}
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 auto-rows-fr">
            {/* Green Box Mic */}
            <ItemUp>
              <div className="relative rounded-3xl p-[1px] bg-gradient-to-br from-green-200/70 to-emerald-300/60 shadow-sm h-full">
                <div className="rounded-3xl bg-white p-7 h-full flex flex-col">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-farm-dark">Green Box Mic</h3>
                    <span className="text-[10px] uppercase tracking-wide bg-emerald-100 text-emerald-800 py-1 px-2 rounded-full">
                      Popular
                    </span>
                  </div>
                  <p className="text-gray-600 mt-1">1–2 persoane • selecție săptămânală</p>

                  <div className="mt-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-extrabold text-farm-dark leading-none">299</span>
                      <span className="text-sm text-gray-500">lei / lună</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">~3–5 kg/săpt • 4 livrări</p>
                  </div>

                  <ul className="mt-6 space-y-2 text-sm text-gray-700">
                    {["4–8 produse de sezon", "Fermieri locali verificați", "Ambalaje reciclabile"].map((f, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 mt-0.5 text-emerald-600" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Mini calendar */}
                  <MonthProducts
                    items={[
                      "Morcovi",
                      "Cartofi noi",
                      "Mere roșii",
                      "Varză albă",
                      "Dovleac plăcintar",
                      "Salată verde",
                    ]}
                  />


                  {/* CTA pinned bottom */}
                  <div className="mt-auto pt-7">
                    <CheckoutButton
                      priceId={priceBasic}
                      customerEmail={email}
                      label="Începe cu Green Mic"
                      mode="subscription"
                    />
                    <p className="text-[11px] text-gray-500 mt-2">Anulezi oricând.</p>
                  </div>
                </div>
              </div>
            </ItemUp>

            {/* Green Box Mare */}
            <ItemUp>
              <div className="relative rounded-3xl p-[1px] bg-gradient-to-br from-green-300/80 to-emerald-400/60 shadow-md h-full">
                <div className="rounded-3xl bg-white p-7 h-full flex flex-col ring-1 ring-emerald-100">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-farm-dark">Green Box Mare</h3>
                    <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wide bg-farm-green text-white py-1 px-2 rounded-full">
                      <Sparkles className="h-3 w-3" /> Recomandat
                    </span>
                  </div>
                  <p className="text-gray-600 mt-1">Familii • porții mai mari</p>

                  <div className="mt-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-extrabold text-farm-dark leading-none">550</span>
                      <span className="text-sm text-gray-500">lei / lună</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">~8–10 kg/săpt • 4 livrări</p>
                  </div>

                  <ul className="mt-6 space-y-2 text-sm text-gray-700">
                    {["4–10 produse premium", "Selecție prioritară", "Livrare inclusă"].map((f, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 mt-0.5 text-emerald-600" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <MonthProducts
                    items={[
                      "Morcovi",
                      "Cartofi dulci",
                      "Pere",
                      "Varză roșie",
                      "Conopidă",
                      "Ouă de țară",
                    ]}
                  />


                  <div className="mt-auto pt-7">
                    <CheckoutButton
                      priceId={pricePro}
                      customerEmail={email}
                      label="Alege Green Mare"
                      mode="subscription"
                    />
                    <p className="text-[11px] text-gray-500 mt-2">Gestionare rapidă din cont.</p>
                  </div>
                </div>
              </div>
            </ItemUp>

            {/* Pro Box Mic */}
            <ItemUp>
              <div className="relative rounded-3xl p-[1px] bg-gradient-to-br from-amber-200/80 to-orange-300/60 shadow-sm h-full">
                <div className="rounded-3xl bg-white p-7 h-full flex flex-col">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-farm-dark">Pro Box Mic</h3>
                    <span className="text-[10px] uppercase tracking-wide bg-amber-100 text-amber-800 py-1 px-2 rounded-full">
                      Nou
                    </span>
                  </div>
                  <p className="text-gray-600 mt-1">Selecție premium • 2–3 persoane</p>

                  <div className="mt-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-extrabold text-farm-dark leading-none">649</span>
                      <span className="text-sm text-gray-500">lei / lună</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">~6–8 kg/săpt • 4 livrări</p>
                  </div>

                  <ul className="mt-6 space-y-2 text-sm text-gray-700">
                    {["Produse artizanale premium", "Selecții de sezon extinse", "Ambalare atentă, eco"].map((f, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 mt-0.5 text-amber-600" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <MonthProducts
                    items={[
                      "Dovleac plăcintar",
                      "Struguri",
                      "Brânză de capră",
                      "Ciuperci champignon",
                      "Roșii uscate",
                      "Pâine cu maia",
                    ]}
                  />


                  <div className="mt-auto pt-7">
                    <CheckoutButton
                      priceId={priceProMic}
                      customerEmail={email}
                      label="Alege Pro Mic"
                      mode="subscription"
                    />
                    <p className="text-[11px] text-gray-500 mt-2">Anulezi oricând, fără penalizări.</p>
                  </div>
                </div>
              </div>
            </ItemUp>

            {/* Pro Box Mare */}
            <ItemUp>
              <div className="relative rounded-3xl p-[1px] bg-gradient-to-br from-amber-300 via-emerald-300 to-green-300 shadow-md h-full">
                <div className="rounded-3xl bg-white p-7 h-full flex flex-col ring-1 ring-emerald-100">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-farm-dark">Pro Box Mare</h3>
                    <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wide bg-emerald-600 text-white py-1 px-2 rounded-full">
                      <Crown className="h-3.5 w-3.5" /> Value
                    </span>
                  </div>
                  <p className="text-gray-600 mt-1">Selecție premium • 3–5 persoane</p>

                  <div className="mt-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-extrabold text-farm-dark leading-none">849</span>
                      <span className="text-sm text-gray-500">lei / lună</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">~10–14 kg/săpt • 4 livrări</p>
                  </div>

                  <ul className="mt-6 space-y-2 text-sm text-gray-700">
                    {["10–14 produse premium", "Prioritate maximă la selecție", "Livrare inclusă "].map((f, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 mt-0.5 text-emerald-600" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <MonthProducts
                    items={[
                      "Broccoli bio",
                      "Vinete coapte",
                      "Cașcaval maturat",
                      "Mere fuji",
                      "Prune afumate",
                      "Miere polifloră",
                    ]}
                  />


                  <div className="mt-auto pt-7">
                    <CheckoutButton
                      priceId={priceProMare}
                      customerEmail={email}
                      label="Alege Pro Mare"
                      mode="subscription"
                    />
                    <p className="text-[11px] text-gray-500 mt-2">Livrare inclusă + suport prioritar.</p>
                  </div>
                </div>
              </div>
            </ItemUp>
          </div>

          <FadeIn delay={0.1}>
            <div className="flex flex-wrap items-center justify-center gap-4 mt-10 text-sm text-gray-600">
              <div className="flex items-center gap-2"><span>🔁</span> Pauză/Anulare dintr-un click</div>
              <div className="flex items-center gap-2"><span>🔒</span> Plăți securizate Stripe</div>
              <div className="flex items-center gap-2"><span>🌱</span> Ambalaje eco</div>
              <div className="flex items-center gap-2"><span>📦</span> 4 livrări/lună</div>
            </div>
          </FadeIn>
        </section>

        {/* TESTIMONIALS — nume sus + stele */}
        <section className="max-w-6xl mx-auto px-4 py-10">
          <Stagger>
            <div className="grid md:grid-cols-3 gap-6 auto-rows-fr">
              {[
                { n: "Mara D.", t: "Cutia Basic ne ajunge perfect pentru săptămână. Totul foarte gustos.", r: 5 },
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
        </section>

        {/* FAQ */}
        <section className="max-w-4xl mx-auto px-4 py-10">
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
                { q: "Pot anula abonamentul?", a: "Da. Abonamentul este lunar și poți anula din contul tău după fiecare lună." },
                { q: "Ce metode de plată acceptați?", a: "Plăți securizate prin Stripe (carduri principale, Apple/Google Pay unde e disponibil)." },
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
              <a href="#pricing" className="btn btn-primary text-base">Începe astăzi</a>
            </div>
          </FadeIn>
        </section>

        {/* FOOTER */}
        <footer className="border-t">
          <div className="max-w-6xl mx-auto px-4 py-10 text-sm text-gray-600 flex flex-col gap-6">
            <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
              <div>© {new Date().getFullYear()} GreenMart</div>
              <div className="flex gap-4">
                <a href="/termeni" className="hover:text-farm-dark">Termeni</a>
                <a href="/confidentialitate" className="hover:text-farm-dark">Confidențialitate</a>
              </div>
            </div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 text-center md:text-left">
              <p>
                <span className="font-medium">Email:</span>{" "}
                <a href="mailto:greenmart@writeme.com" className="hover:text-farm-dark">greenmart@writeme.com</a>
              </p>
              <p><span className="font-medium">Telefon:</span> +40 742 220 938</p>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
