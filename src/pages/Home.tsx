import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Header } from "../components/Header";
import { CheckoutButton } from "../components/CheckoutButton";
import { supabase } from "../lib/supabase";
import { CheckCircle2, Sparkles } from "lucide-react";

/** Stripe */
const priceBasic = import.meta.env.VITE_STRIPE_PRICE_BASIC as string; // Green Box Mic
const pricePro = import.meta.env.VITE_STRIPE_PRICE_PRO as string;   // Green Box Mare

/** Helper bullet */
function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2 text-gray-700">
      <CheckCircle2 className="h-4 w-4 mt-0.5 text-farm-green" />
      <span>{children}</span>
    </li>
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
      <Header overlay />

      <main className="bg-white text-farm-dark">
        {/* HERO — full screen bg, text centrat */}
        <section
          className="
    relative isolate
    min-h-screen
    flex items-center justify-center
    overflow-hidden
  "
        >
          {/* video de fundal: full-bleed, centrat */}
          <video
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            aria-hidden
          >
            <source src="https://static.vecteezy.com/system/resources/previews/048/005/897/mp4/fresh-vegetables-in-vegetables-market-seller-displayed-colorful-vegetables-in-a-stall-many-varieties-of-colorful-vegetables-free-video.mp4" type="video/mp4" />
          </video>

          {/* overlay pt. lizibilitate (poți crește/scădea opacitatea) */}
          <div className="absolute inset-0 bg-black/70" />

          {/* conținut pe mijloc, text centrat */}
          <div className="relative z-10 w-full max-w-3xl px-4 text-center">
            <h1 className="font-heading text-4xl md:text-5xl font-bold leading-none md:leading-none" >
              <span className="block mb-0 md:mb-4 text-white">Mereu proaspete,</span>
              <span className="block mb-0 text-white">uneori „imperfecte”.</span>
            </h1>
            <p className="text-white mt-8 text-2xl md:text-3xl drop-shadow-lg">
              Produse locale livrate direct la ușa ta, <br></br><b className="text-2xl font-bold md:text-3xl">până la 40% mai avantajos</b> decât supermarketul.
            </p>

            <div className="mt-9 flex justify-center">
              <a
                href="#pricing"
                className="
                inline-block
                rounded-md
                bg-farm-green
                px-10 py-5
                text-xl font-heading font-bold text-white
                shadow-lg shadow-green-600/30
                hover:bg-green-700
                hover:shadow-xl hover:shadow-green-700/40
                transition-all duration-200
              "
              // style={{ color: '#2d2d2d' }}
              >
                Comandă acum
              </a>
            </div>
          </div>

        </section>

        {/* ========== MEET (text stânga, imagine dreapta) ========== */}
        <section className="py-16 md:py-20 bg-white">
          <div className="mx-auto w-full max-w-5xl px-4 grid lg:grid-cols-2 gap-10 items-center">
            {/* Text (stânga pe desktop, sus pe mobil) */}
            <div className="text-center lg:text-left">
              <div className="flex flex-col items-center">
                <h2 className="text-3xl md:text-4xl font-extrabold">Cunoaște GreenMart</h2>
                <div className="w-24 h-1 my-6 bg-farm-green rounded-full" />
              </div>
              <p className="mt-3 text-gray-700 md:text-2xl">
                Abonament cu legume și fructe locale, uneori „imperfecte” ca aspect, ca să
                rupi cercul risipei și să mănânci mai bine, fără bătăi de cap. Susținem
                fermierii din zonă și aducem prospețimea direct la tine.
              </p>
            </div>

            {/* Imagine (dreapta pe desktop, jos pe mobil) */}
            <div className="relative w-full md:h-[50vh] overflow-hidden rounded-3xl shadow-sm ring-1 ring-black/5 flex items-center justify-center">
              <img
                src="https://hasxcndrhvtyjphntpft.supabase.co/storage/v1/object/public/images/og-hero.jpeg"
                alt="Cutia GreenMart cu produse locale"
                className="object-cover w-full h-full"
                style={{ maxHeight: '50vh' }}
                loading="lazy"
              />
            </div>
          </div>
        </section>

        {/* ========== HOW IT WORKS (stil Misfits Market) ========== */}
        <section id="how" className="py-16 md:py-20 bg-white">
          <div className="mx-auto w-full grid lg:grid-cols-2 gap-12 items-center">

            {/* Imagine stânga */}
            <div className="relative w-full h-full min-h-[250px] md:min-h-[400px] overflow-hidden rounded-3xl flex items-center justify-center">
              <img
                src="https://hasxcndrhvtyjphntpft.supabase.co/storage/v1/object/public/images/box.png"
                alt="Livrare GreenMart"
                className="object-cover w-full h-full"
                style={{ maxHeight: '1080px' }}
                loading="lazy"
              />
            </div>

            {/* Text dreapta */}
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold">Cum funcționează</h2>
              <p className="mt-3 text-gray-700 text-lg">
                De la fermieri locali la ușa ta în doar câțiva pași simpli:
              </p>

              <div className="mt-6 space-y-5">
                {[
                  { step: "1", t: "Alegi cutia", d: "Selectezi dimensiunea care ți se potrivește — Mică sau Mare." },
                  { step: "2", t: "Noi pregătim", d: "Adunăm produsele de sezon, verificăm calitatea și împachetăm." },
                  { step: "3", t: "Livrare la ușă", d: "În fiecare sâmbătă, cutia ta sosește proaspătă, gata de gătit." },
                ].map((s) => (
                  <div key={s.step} className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-farm-green text-white font-bold grid place-items-center">
                      {s.step}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">{s.t}</h3>
                      <p className="text-gray-600">{s.d}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Link către FAQ */}
              <div className="mt-8">
                <a
                  href="#faq"
                  className="text-farm-green font-semibold hover:underline"
                >
                  Vezi întrebările frecvente →
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ========== OUR BOXES (stil Misfits, text sub imagine, sticker overlap) ========== */}
        <section id="pricing" className="py-16 md:py-20 bg-white">
          <div className="mx-auto w-full max-w-6xl px-4">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-extrabold">Cutii disponibile</h2>
              <p className="mt-2 text-gray-600">Simplu, clar, fără bătăi de cap.</p>
            </div>

            <div className="grid gap-10 md:grid-cols-2">
              {/* Green Box Mic */}
              <div className="flex flex-col items-center">
                <div className="relative w-full max-w-lg overflow-visible">
                  {/* imagine mai mare */}
                  <div className="pt-[100%]" />
                  <img
                    src="https://hasxcndrhvtyjphntpft.supabase.co/storage/v1/object/public/images/boxmic.png"
                    alt="Green Box Mic"
                    className="absolute inset-0 h-full w-full object-cover rounded-3xl shadow-md"
                  />
                  {/* sticker preț jumătate în afară */}
                  <div
                    className="absolute top-10 -right-20 w-[156px] h-[156px] bg-no-repeat bg-contain"
                    style={{
                      backgroundImage:
                        "url('https://web.archive.org/web/20220904103335im_/http://static.misfitsmarket.com/images/sticker_pricing-mischief-yellow-shadow.png')",
                    }}
                  />
                </div>

                <div className="mt-8 text-center">
                  <h3 className="text-2xl font-extrabold text-farm-dark">Green Box Mic</h3>
                  <p className="mt-1 text-gray-600">Aproximativ 8-10 kgs de legume organice + fructe <br></br>Destul pentru pana la 5 persoane pe saptamana <br></br>Ideal pentru mai multe persoane, familii care gatesc zilnic</p>

                  <div className="mt-4">
                    <span className="text-4xl font-extrabold text-farm-dark">299</span>
                    <span className="ml-1 text-sm text-gray-500">lei / lună</span>
                    <p className="text-xs text-gray-500 mt-1">4 livrări • ~3–5 kg/săpt</p>
                  </div>

                  <div className="mt-6">
                    <CheckoutButton
                      priceId={priceBasic}
                      customerEmail={email}
                      label="Comandă Green Mic"
                      mode="subscription"
                    />
                  </div>
                </div>
              </div>

              {/* Green Box Mare */}
              <div className="flex flex-col items-center">
                <div className="relative w-full max-w-lg overflow-visible">
                  <div className="pt-[100%]" />
                  <img
                    src="https://hasxcndrhvtyjphntpft.supabase.co/storage/v1/object/public/images/boxmic.png"
                    alt="Green Box Mare"
                    className="absolute inset-0 h-full w-full object-cover rounded-3xl shadow-md"
                  />
                  <div
                    className="absolute top-10 -right-20 w-[156px] h-[156px] bg-no-repeat bg-contain"
                    style={{
                      backgroundImage:
                        "url('https://web.archive.org/web/20220904103335im_/http://static.misfitsmarket.com/images/sticker_pricing-mischief-yellow-shadow.png')",
                    }}
                  />
                </div>

                <div className="mt-8 text-center">
                  <h3 className="text-2xl font-extrabold text-farm-dark">Green Box Mare</h3>
                  <p className="mt-1 text-gray-600">Aproximativ 4-5 kgs de legume organice + fructe <br></br>Destul pentru pana la 5 persoane pe saptamana <br></br>Ideal pentru mai multe persoane, familii care gatesc zilnic</p>

                  <div className="mt-4">
                    <span className="text-4xl font-extrabold text-farm-dark">550</span>
                    <span className="ml-1 text-sm text-gray-500">lei / lună</span>
                    <p className="text-xs text-gray-500 mt-1">4 livrări • ~8–10 kg/săpt</p>
                  </div>

                  <div className="mt-6">
                    <CheckoutButton
                      priceId={pricePro}
                      customerEmail={email}
                      label="Alege Green Mare"
                      mode="subscription"
                    />
                  </div>
                </div>
              </div>
            </div>

            <p className="mt-12 text-center text-xs text-gray-500">
              Produsele pot varia în funcție de sezonalitate și disponibilitate.
            </p>
          </div>
        </section>


        {/* ========== WHAT'S A MISFIT? (bullets + imagine 3:2) ========== */}
        <section className="py-16 md:py-20 bg-white">
          <div className="mx-auto w-full max-w-5xl px-4 grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold">Ce primești în cutie</h2>
              <ul className="mt-5 space-y-2 text-gray-700">
                <li>• Surplus de la ferme locale</li>
                <li>• Dimensiuni „neobișnuite”, gust excelent</li>
                <li>• Imperfecțiuni cosmetice, nu de calitate</li>
                <li>• Recolte autentice, de sezon</li>
                <li>• Întotdeauna gustoase și hrănitoare</li>
              </ul>
            </div>
            <div className="relative w-full md:h-[50vh] overflow-hidden rounded-3xl shadow-sm ring-1 ring-black/5 flex items-center justify-center">
              <img
                src="https://hasxcndrhvtyjphntpft.supabase.co/storage/v1/object/public/images/family-cooking.jpg"
                alt="Legume de sezon"
                className="object-cover w-full h-full"
                style={{ maxHeight: '50vh' }}
              />
            </div>
          </div>
        </section>


        {/* ========== WHY/PURPOSE (3 blocuri simple) ========== */}
        <section className="py-16 md:py-20 bg-white">
          <div className="mx-auto w-full max-w-5xl px-4 grid md:grid-cols-3 gap-6">
            {[
              { t: "Economisești", d: "Până la 40% mai accesibil decât supermarketul." },
              { t: "Oprești risipa", d: "Ajuți ca mâncarea bună să ajungă pe masă, nu la gunoi." },
              { t: "Mai bine pentru toți", d: "Susții fermierii locali și sănătatea familiei." },
            ].map((b) => (
              <div key={b.t} className="card p-6 h-full">
                <h3 className="text-xl font-bold">{b.t}</h3>
                <p className="mt-2 text-gray-600">{b.d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ========== PRESS (grid de citate/logo – optional, placeholder) ========== */}
        <section className="py-16 md:py-20 bg-white">
          <div className="mx-auto w-full max-w-5xl px-4">
            <h3 className="text-center text-2xl font-extrabold mb-8">Presă</h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 text-center text-gray-600">
              <div className="p-4 border rounded-xl">„E despre a face lucrurile corect.”</div>
              <div className="p-4 border rounded-xl">„Mănâncă legume ‘ugly’ în loc să le arunci.”</div>
              <div className="p-4 border rounded-xl">„Sunt fan, recomand oricui.”</div>
              <div className="p-4 border rounded-xl">„Totul e proaspăt. Foarte bun.”</div>
            </div>
          </div>
        </section>

        {/* ========== CTA final ========== */}
        <section className="py-16 md:py-20 bg-white">
          <div className="mx-auto w-full max-w-3xl px-4 text-center">
            <h3 className="text-2xl md:text-3xl font-extrabold">Gata să începi?</h3>
            <p className="mt-2 text-gray-700">
              Mănânci mai bine, economisești timp. Abonează-te în 2 minute.
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <a href="#pricing" className="btn btn-primary">Comandă acum</a>
              <Link to="/confidentialitate" className="btn btn-outline">Află mai multe</Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
