// src/pages/Home.tsx
import { Link } from "react-router-dom";
import { Header } from "../components/Header";
import { CheckoutButton } from "../components/CheckoutButton";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { FadeIn, Stagger, ItemUp, HoverCard, Motion, MotionButton } from "../components/motion";

const priceBasic = import.meta.env.VITE_STRIPE_PRICE_BASIC as string;
const pricePro = import.meta.env.VITE_STRIPE_PRICE_PRO as string;

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
                  Cutii cu legume proaspete <span className="text-farm-green">livrate săptămânal, în fiecare sâmbătă</span>
                </h1>
                <p className="text-gray-700 mt-4 text-lg">
                  Primești săptămânal o cutie surpriză cu legume locale, fructe și produse artizanale. Gătești rapid, mănânci echilibrat și susții fermierii din România mai accesibil si ușor decât a fost vreodată.
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

            {/* Imagine cu micro‑interacțiune */}
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

        {/* WHY CHOOSE — secțiunea din imagine */}
        <section id="why-choose" className="bg-white/70">
          <div className="max-w-6xl mx-auto px-4 py-12">
            <div className="grid lg:grid-cols-2 gap-10 items-center">
              {/* Img left */}
              <FadeIn y={16}>
                <div className="rounded-3xl overflow-hidden shadow-sm ring-1 ring-black/5">
                  <img
                    src="https://hasxcndrhvtyjphntpft.supabase.co/storage/v1/object/public/images/family-cooking.jpg" // ← schimbă cu imaginea ta
                    alt="Familie gătind cu legume proaspete"
                    className="w-full h-full object-cover"
                  />
                </div>
              </FadeIn>

              {/* Content right */}
              <Stagger gap={0.08}>
                <div id="info">
                  <ItemUp>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-farm-dark">
                      De ce să alegi GreenMart?
                    </h2>
                  </ItemUp>
                  <ItemUp>
                    <p className="text-farm-green/90 mt-2 text-lg">
                      Transformă‑ți bucătăria într‑un sanctuar al prospețimii și sănătății
                    </p>
                  </ItemUp>

                  <div className="mt-6 space-y-3 text-gray-700">
                    {[
                      "Între 22 și 25 kg de legume, fructe și produse artizanale livrate direct la ușa ta lunar, în funcție de disponibilitate",
                      "Primești săptămânal legume proaspete și produse artizanale direct de la mici producători locali verificați",
                      "Nu plătești pentru o etichetă, plătești pentru calitate",
                      "Te bucuri de alimente naturale, gustoase și hrănitoare pentru tine și familia ta",
                      "Timpul pierdut la cumpărături este transformat în timp pentru lucrurile care chiar contează",
                      "Contribui activ la reducerea risipei alimentare și a poluării",
                      "Sprijini fermierii locali și faci parte dintr‑o comunitate sustenabilă",
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

        {/* WHY / BENEFITS */}
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
                <ItemUp>
                  <HoverCard className="card p-6 h-full">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 rounded-full bg-farm-green/10 text-farm-green grid place-items-center font-bold">1</div>
                      <span className="text-2xl">🧺</span>
                    </div>
                    <h3 className="text-lg font-bold text-farm-dark">Alege box-ul preferat</h3>
                    <p className="text-gray-600 mt-2">
                      Toate conțin legume proaspete și produse artizanale, de sezon, direct de la fermierii locali.
                      Diferența o face cantitatea necesară ție.
                    </p>
                  </HoverCard>
                </ItemUp>

                <ItemUp>
                  <HoverCard className="card p-6 h-full">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 rounded-full bg-farm-green/10 text-farm-green grid place-items-center font-bold">2</div>
                      <span className="text-2xl">🚚</span>
                    </div>
                    <h3 className="text-lg font-bold text-farm-dark">În tranzit</h3>
                    <p className="text-gray-600 mt-2">
                      Comanda se face săptămânal, rapid și fără obligații pe termen lung.
                      Ne ocupăm noi de tot ce ține de selecție, împachetare și prospețime.
                    </p>
                  </HoverCard>
                </ItemUp>

                <ItemUp>
                  <HoverCard className="card p-6 h-full">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 rounded-full bg-farm-green/10 text-farm-green grid place-items-center font-bold">3</div>
                      <span className="text-2xl">🏠</span>
                    </div>
                    <h3 className="text-lg font-bold text-farm-dark">Ajunge la tine</h3>
                    <p className="text-gray-600 mt-2">
                      Livrăm cu grijă produsele la tine acasă. Nu pierzi timp în trafic, nu mai cari sacoșe, nu mai stai în supermarket.
                      Îți poți dedica timpul și banii pentru ce contează cu adevărat.
                    </p>
                  </HoverCard>
                </ItemUp>

                <ItemUp>
                  <HoverCard className="card p-6 h-full">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 rounded-full bg-farm-green/10 text-farm-green grid place-items-center font-bold">4</div>
                      <span className="text-2xl">🥗</span>
                    </div>
                    <h3 className="text-lg font-bold text-farm-dark">Gătești rapid. Mănânci echilibrat. Te simți bine.</h3>
                    <p className="text-gray-600 mt-2">
                      Fiecare box include rețete propuse de nutriționiști, pe care le poți prepara ușor acasă.
                      Fără risipă, fără stres, cu impact real asupra sănătății tale.
                    </p>
                  </HoverCard>
                </ItemUp>
              </div>
            </Stagger>
          </div>
        </section>

        {/* PRICING */}
        <section id="pricing" className="max-w-6xl mx-auto px-4 py-12">
          <FadeIn>
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-extrabold text-farm-dark">Alege pachetul</h2>
              <p className="text-gray-600 mt-2">Fără obligații pe termen lung. Poți întrerupe oricând.</p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-6">
            <ItemUp>
              <HoverCard className="card p-8 flex flex-col h-full">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-farm-dark">Green Box</h3>
                  <span className="text-xs bg-farm-light text-farm-dark py-1 px-2 rounded-full">Cel mai iubit</span>
                </div>
                <p className="text-gray-600 mt-1">Pentru 1–2 persoane • selecție săptămânală</p>
                <div className="mt-5 text-4xl font-extrabold text-farm-dark">
                  299<span className="text-base text-gray-500"> lei/lună</span>
                </div>
                <ul className="mt-5 space-y-2 text-gray-700">
                  <li>• ~4–8 produse de sezon</li>
                  <li>• Fermieri locali verificați</li>
                  <li>• 4-6 kg livrate săptămânal</li>
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
              </HoverCard>
            </ItemUp>

            <ItemUp>
              <HoverCard className="card p-8 ring-2 ring-farm-green flex flex-col h-full">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-farm-dark">Pro Box</h3>
                  <span className="text-xs bg-farm-green text-white py-1 px-2 rounded-full">Recomandat</span>
                </div>
                <p className="text-gray-600 mt-1">Pentru familii • varietate și porții mai mari</p>
                <div className="mt-5 text-4xl font-extrabold text-farm-dark">
                  550<span className="text-base text-gray-500"> lei/lună</span>
                </div>
                <ul className="mt-5 space-y-2 text-gray-700">
                  <li>• ~8–12 produse premium</li>
                  <li>• Selecție prioritară</li>
                  <li>• 10-12 kg livrate săptămânal</li>
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
              </HoverCard>
            </ItemUp>
          </div>

          <FadeIn delay={0.1}>
            <div className="flex flex-wrap items-center justify-center gap-4 mt-8 text-sm text-gray-600">
              <div className="flex items-center gap-2"><span>🔁</span> Pauză/Anulare dintr-un click</div>
              <div className="flex items-center gap-2"><span>🌱</span> Ambalaje prietenoase cu mediul</div>
              <div className="flex items-center gap-2"><span>💬</span> Suport rapid pe email</div>
            </div>
          </FadeIn>
        </section>

        {/* TESTIMONIALS */}
        <section className="max-w-6xl mx-auto px-4 py-10">
          <Stagger>
            <div className="grid md:grid-cols-3 gap-6 auto-rows-fr">
              {[
                { n: "Mara D.", t: "Cutia Basic ne ajunge perfect pentru săptămână. Totul foarte gustos." },
                { n: "Andrei P.", t: "Fără stres: vin mereu produse proaspete. Recomand Pro pentru varietate." },
                { n: "Ioana R.", t: "Îmi place că este mai mult decât o experiență, este un lifestyle." },
              ].map((c, i) => (
                <ItemUp key={i}>
                  <HoverCard className="card p-6 h-full">
                    <p className="text-gray-700">“{c.t}”</p>
                    <p className="mt-3 text-sm text-gray-500">— {c.n}</p>
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
              <ItemUp>
                <details className="card p-5">
                  <summary className="cursor-pointer font-semibold text-farm-dark">Care sunt beneficiile de a comanda de la noi?</summary>
                  <p className="text-gray-600 mt-2">Beneficiezi mereu de o supriză și varietate, nu mai trebuie să Îți pierzi timpul în magazin, livrare la ușă, și suport dedicat pentru clienți. De asemenea, produsele sunt proaspete și de calitate superioară, dacă vrei să înveți mai multe despre ele poți afla pe acest <a href="/produse-locale" className="text-farm-green">link</a>.</p>
                </details>
              </ItemUp>
              <ItemUp>
                <details className="card p-5">
                  <summary className="cursor-pointer font-semibold text-farm-dark">Cât de sigur este să comanzi de la producători locali?</summary>
                  <p className="text-gray-600 mt-2">Produsele sunt atent selecționate și verificate pentru a asigura calitatea și siguranța. Colaborăm doar cu producători locali de încredere, care respectă standardele de siguranță alimentară. Dacă ai vrea sa știi mai multe poți afla de pe acest <a href="/producatori" className="text-farm-green">link</a>.</p>
                </details>
              </ItemUp>
              <ItemUp>
                <details className="card p-5">
                  <summary className="cursor-pointer font-semibold text-farm-dark">Pot anula abonamentul?</summary>
                  <p className="text-gray-600 mt-2">Da. Abonamentul este lunar și poți anula după fiecare lună. Poți face asta din contul tău, dacă ai probleme ne poți contacta oricând la greenmart@writeme.com.</p>
                </details>
              </ItemUp>
              <ItemUp>
                <details className="card p-5">
                  <summary className="cursor-pointer font-semibold text-farm-dark">Ce metode de plată acceptați?</summary>
                  <p className="text-gray-600 mt-2">Plăți securizate prin Stripe (carduri principale, Apple/Google Pay unde e disponibil).</p>
                </details>
              </ItemUp>
              <ItemUp>
                <details className="card p-5">
                  <summary className="cursor-pointer font-semibold text-farm-dark">Livrați în zona mea?</summary>
                  <p className="text-gray-600 mt-2">În momentul de față livrăm doar în Timișoara, ne uităm pentru a ne extinde în curând.</p>
                </details>
              </ItemUp>
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
            {/* top row: copy + links */}
            <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
              <div>© {new Date().getFullYear()} GreenMart</div>
              <div className="flex gap-4">
                <a href="/termeni" className="hover:text-farm-dark">Termeni</a>
                <a href="/confidentialitate" className="hover:text-farm-dark">Confidențialitate</a>
              </div>
            </div>

            {/* contact info row */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 text-center md:text-left">
              <p>
                <span className="font-medium">Email:</span>{" "}
                <a href="mailto:greenmart@writeme.com" className="hover:text-farm-dark">
                  greenmart@writeme.com
                </a>
              </p>
              <p><span className="font-medium">Telefon:</span> +40 742 220 938</p>
            </div>
          </div>
        </footer>

      </main>
    </>
  );
}
