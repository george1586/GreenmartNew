// src/pages/LocalProducts.tsx
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { FadeIn, ItemUp, Stagger } from "../components/motion";
import { Header } from "../components/Header";

export function LocalProducts() {
    return (
        <>
            <Header></Header>
            <main className="bg-gradient-to-b from-white to-farm-light min-h-screen">
                <Helmet>
                    <title>Produse locale Timișoara – „calitatea a doua”, prețuri și impactul risipei | Greenmart</title>
                    <meta
                        name="description"
                        content="De ce „calitatea a doua” nu înseamnă calitate proastă, cum se formează prețurile din magazine și de ce risipa alimentară poluează mult mai mult decât aviația."
                    />
                    <link rel="canonical" href="https://greenmart.ro/produse-locale-timisoara" />
                    <meta name="robots" content="index,follow" />
                </Helmet>

                <section className="max-w-6xl mx-auto px-4 py-10 md:py-14">
                    <FadeIn>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-farm-dark">
                            Produse locale: „calitatea a doua” nu înseamnă „mai puțin bune”
                        </h1>
                        <p className="text-gray-700 mt-3 text-lg max-w-3xl">
                            La standul producătorului, vei vedea adesea legume sau fructe care nu sunt „de revistă”: forme neregulate,
                            mici lovituri sau variații de culoare. Acestea sunt, de obicei, încadrate în <strong>Clasa II</strong> („calitatea a doua”)
                            și <em>sunt perfect comestibile</em>. În Uniunea Europeană, chiar și Clasa II trebuie să fie <strong>„sănătoase, corecte și de calitate comercializabilă”</strong>
                            și să indice țara de origine – adică potrivite pentru consum, doar cu defecte cosmetice tolerabile. Vezi regulile
                            din organizarea comună a pieței:{" "}
                            <a
                                className="underline text-farm-green"
                                href="https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=CELEX%3A02013R1308-20230101"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                art. 76 din Reg. (UE) 1308/2013
                            </a>{" "}
                            și standardele/ghidurile aferente claselor („Extra”, I, II) bazate pe standardele UNECE.
                        </p>
                    </FadeIn>

                    {/* Ce înseamnă concret „Clasa II” */}
                    <section className="mt-10">
                        <FadeIn>
                            <h2 className="text-2xl md:text-3xl font-extrabold text-farm-dark">Ce înseamnă „Clasa II” în practică</h2>
                        </FadeIn>
                        <div className="mt-5 space-y-4 text-gray-700 max-w-4xl">
                            <ItemUp>
                                <p>
                                    Conform standardelor recunoscute în UE/UNECE, <strong>Clasa II</strong> permite defecte rezonabile de formă, culoare
                                    sau mici defecte ale cojii, atâta timp cât produsul își păstrează calitatea, păstrarea și prezentarea în ambalaj.
                                    (Exemple în layout-ul UNECE pentru clasificare:{" "}
                                    <a
                                        className="underline text-farm-green"
                                        href="https://unece.org/sites/default/files/2024-09/FFV-StandardLayout-FFV_2021_e.pdf"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        UNECE FFV – Standard Layout
                                    </a>
                                    .)
                                </p>
                            </ItemUp>
                            <ItemUp>
                                <p>
                                    Pe scurt: <strong>nu e „mai puțin comestibilă”</strong>, doar <em>mai puțin arătoasă</em>. Produsele sub Clasa II (care nu
                                    satisfac nici cerințele minime) nu se comercializează pentru consum proaspăt.
                                </p>
                            </ItemUp>
                        </div>
                    </section>

                    {/* De ce pot fi prețurile din magazin mai mari */}
                    <section className="mt-12">
                        <FadeIn>
                            <h2 className="text-2xl md:text-3xl font-extrabold text-farm-dark">De ce pot fi prețurile din magazine mai mari</h2>
                        </FadeIn>
                        <div className="mt-5 space-y-4 text-gray-700 max-w-4xl">
                            <ItemUp>
                                <p>
                                    <strong>Lanț logistic lung & pierderi („shrink”):</strong> sortare strictă pe aspect, ambalare, depozitare, transport,
                                    retururi și produse aruncate. Toate acestea se reflectă în prețul final.
                                </p>
                            </ItemUp>
                            <ItemUp>
                                <p>
                                    <strong>Costuri fixe & intermedieri:</strong> chirii mari, personal, energie, marketing, comisioane pe lanț – adesea
                                    mai multe verigi față de vânzarea directă de la fermier.
                                </p>
                            </ItemUp>
                            <ItemUp>
                                <p>
                                    <strong>Specificații cosmetice:</strong> multe loturi conforme ca siguranță și prospețime sunt respinse doar pentru
                                    aspect. Cumpărând „calitatea a doua”, <em>plătești pentru produs</em>, nu pentru perfecțiunea vizuală.
                                </p>
                            </ItemUp>
                        </div>
                    </section>

                    {/* Impact climatic al risipei alimentare */}
                    <section className="mt-12">
                        <FadeIn>
                            <h2 className="text-2xl md:text-3xl font-extrabold text-farm-dark">De ce contează: risipa alimentară ≫ aviația</h2>
                        </FadeIn>
                        <div className="mt-5 space-y-4 text-gray-700 max-w-4xl">
                            <ItemUp>
                                <p>
                                    La nivel global, <strong>risipa alimentară</strong> (pe lanțul retail–HoReCa–gospodării) este responsabilă de aproximativ{" "}
                                    <strong>8–10% din emisiile</strong> de gaze cu efect de seră, potrivit{" "}
                                    <a
                                        className="underline text-farm-green"
                                        href="https://www.unep.org/resources/publication/food-waste-index-report-2024"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        UNEP – Food Waste Index 2024
                                    </a>
                                    . Este „aproape de <em>cinci ori</em> mai mult” decât întreg sectorul aviatic, conform{" "}
                                    <a
                                        className="underline text-farm-green"
                                        href="https://unfccc.int/news/food-loss-and-waste-account-for-8-10-of-annual-global-greenhouse-gas-emissions-cost-usd-1-trillion"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        UNFCCC (2024)
                                    </a>
                                    . (Aviatia ≈ <strong>2,5% din CO₂</strong>, respectiv ~4% din încălzirea istorică cu toate efectele non-CO₂ –{" "}
                                    <a
                                        className="underline text-farm-green"
                                        href="https://ourworldindata.org/global-aviation-emissions"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Our World in Data
                                    </a>
                                    .)
                                </p>
                            </ItemUp>
                            <ItemUp>
                                <p>
                                    Când <strong>accepți și cumperi „calitatea a doua”</strong>, ajuți direct la reducerea risipei: mai puține alimente
                                    respinse pe criterii estetice înseamnă mai puține emisii și venit mai corect pentru producători.
                                </p>
                            </ItemUp>
                        </div>
                    </section>

                    {/* Siguranță & conformitate (pe scurt) */}
                    <section className="mt-12">
                        <FadeIn>
                            <h2 className="text-2xl md:text-3xl font-extrabold text-farm-dark">Siguranță: standarde & reziduuri</h2>
                        </FadeIn>
                        <div className="mt-5 space-y-4 text-gray-700 max-w-4xl">
                            <ItemUp>
                                <p>
                                    Indiferent de clasă, produsele proaspete trebuie să respecte cerințele minime și trasabilitatea,
                                    iar reziduurile de pesticide trebuie să fie sub <strong>MRL</strong>-urile din{" "}
                                    <a
                                        className="underline text-farm-green"
                                        href="https://food.ec.europa.eu/plants/pesticides/maximum-residue-levels_en"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        cadrul UE (Reg. 396/2005)
                                    </a>
                                    . Asta înseamnă că <em>„Clasa II” nu înseamnă lipsă de siguranță</em>.
                                </p>
                            </ItemUp>
                        </div>
                    </section>

                    {/* Ce poți face tu */}
                    <section className="mt-12">
                        <FadeIn>
                            <h2 className="text-2xl md:text-3xl font-extrabold text-farm-dark">Cum poți susține producătorii locali</h2>
                        </FadeIn>
                        <ul className="mt-5 space-y-3 text-gray-700 max-w-4xl list-disc pl-5">
                            <Stagger>
                                <ItemUp>
                                    <li>
                                        Cumpără <strong>legume „urățele”</strong> sau pachete mixte ce includ Clasa II – sunt la fel de gustoase.
                                    </li>
                                </ItemUp>
                                <ItemUp>
                                    <li>
                                        Preferă <strong>sezonul</strong> și <strong>lanțurile scurte</strong> (coșuri locale, piețe ale producătorilor).
                                    </li>
                                </ItemUp>
                                <ItemUp>
                                    <li>
                                        Planifică mesele pentru a <strong>reduce risipa</strong>; păstrează corect și gătește creativ surplusul.
                                    </li>
                                </ItemUp>
                            </Stagger>
                        </ul>

                        <Stagger>
                            <div className="card p-6 md:p-8 mt-8 flex items-center justify-between gap-4 flex-col sm:flex-row">
                                <p className="text-farm-dark font-semibold text-center sm:text-left">
                                    Vrei să primești săptămânal cutii locale?
                                </p>
                                <div className="flex gap-3">
                                    <Link to="/subscriptii" className="btn btn-primary">Vezi abonamentele</Link>
                                    <a href="/producatori-locali-timisoara" className="btn btn-outline">Cunoaște producătorii</a>
                                </div>
                            </div>
                        </Stagger>
                    </section>

                    {/* Disclaimer */}
                    <section className="mt-6">
                        <p className="text-xs text-gray-500 max-w-4xl">
                            *Informațiile de pe această pagină sunt orientative; regulile se pot actualiza. Verifică întotdeauna textele în vigoare pe
                            site-urile instituțiilor UE și autorităților naționale competente.
                        </p>
                    </section>
                </section>
            </main>
        </>
    );
}
