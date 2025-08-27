import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { FadeIn, ItemUp, Stagger } from "../components/motion";
import { Header } from "../components/Header";

export function Producers() {
    return (
        <>
            <Helmet>
                <title>Producători locali Timișoara – partenerii Greenmart</title>
                <meta name="description" content="Fermieri, ateliere artizanale și ferme din Timișoara cu care colaborăm." />
                <link rel="canonical" href="https://greenmart.ro/producatori" />
                <meta property="og:type" content="website" />
                <meta property="og:title" content="Producători locali Timișoara – partenerii Greenmart" />
                <meta property="og:description" content="Descoperă fermele și atelierele locale." />
                <meta property="og:url" content="https://greenmart.ro/producatori" />
                <meta property="og:image" content="https://greenmart.ro/fermieri-varza.jpg" />
                <meta name="twitter:card" content="summary_large_image" />
            </Helmet>

            <Header></Header>
            <main className="bg-gradient-to-b from-white to-farm-light min-h-screen">
                <Helmet>
                    <title>Produse locale Timișoara – reguli pentru fermieri & de ce să cumperi local | Greenmart</title>
                    <meta
                        name="description"
                        content="Află pe scurt ce reguli trebuie să respecte fermierii (igienă, trasabilitate, etichetare, MRL pesticide, ecologic) și de ce merită să cumperi de la producători locali."
                    />
                    <link rel="canonical" href="https://greenmart.ro/produse-locale-timisoara" />
                    <meta name="robots" content="index,follow" />
                </Helmet>

                <section className="max-w-6xl mx-auto px-4 py-10 md:py-14">
                    <FadeIn>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-farm-dark">
                            Produse locale din Timișoara: ce trebuie să știi
                        </h1>
                        <p className="text-gray-700 mt-3 text-lg max-w-3xl">
                            Când cumperi de la producători locali, sprijini economia din zonă și primești alimente proaspete, de sezon.
                            Mai jos sunt, pe scurt, regulile esențiale pe care fermierii trebuie să le respecte în UE/RO și motivele pentru
                            care „local” poate fi o alegere mai bună decât magazinul clasic.
                        </p>
                    </FadeIn>

                    {/* Reglementări cheie pentru fermieri */}
                    <section className="mt-10">
                        <FadeIn>
                            <h2 className="text-2xl md:text-3xl font-extrabold text-farm-dark">Reglementări pe care trebuie să le îndeplinească fermierii</h2>
                        </FadeIn>

                        <div className="mt-5 space-y-6 text-gray-700 max-w-4xl">
                            <ItemUp>
                                <div>
                                    <h3 className="font-bold text-farm-dark">1) Igienă și bune practici</h3>
                                    <p className="mt-2">
                                        Producătorii care pun alimente pe piață trebuie să respecte regulile de igienă din{" "}
                                        <a
                                            href="https://eur-lex.europa.eu/eli/reg/2004/852/oj/eng"
                                            className="underline text-farm-green"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            Regulamentul (CE) 852/2004
                                        </a>
                                        . Pentru micii producători există flexibilități proporționale cu riscul, dar principiile
                                        (igienă, apă potabilă, spații curate, prevenirea contaminării) rămân obligatorii.
                                    </p>
                                </div>
                            </ItemUp>

                            <ItemUp>
                                <div>
                                    <h3 className="font-bold text-farm-dark">2) Trasabilitate & responsabilități</h3>
                                    <p className="mt-2">
                                        Orice aliment trebuie să fie trasabil „de la fermă la furculiță”, conform{" "}
                                        <a
                                            href="https://eur-lex.europa.eu/eli/reg/2002/178/oj/eng"
                                            className="underline text-farm-green"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            Regulamentului (CE) 178/2002
                                        </a>
                                        . Producătorul trebuie să știe de la cine a cumpărat și cui a vândut, iar dacă apare un risc,
                                        are obligația retragerii/ informării consumatorilor.
                                    </p>
                                </div>
                            </ItemUp>

                            <ItemUp>
                                <div>
                                    <h3 className="font-bold text-farm-dark">3) Produse de origine animală</h3>
                                    <p className="mt-2">
                                        Lapte, brânzeturi, carne, ouă etc. au reguli suplimentare în{" "}
                                        <a
                                            href="https://eur-lex.europa.eu/eli/reg/2004/853/oj/eng"
                                            className="underline text-farm-green"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            Regulamentul (CE) 853/2004
                                        </a>
                                        : temperaturi corecte, unități aprobate/înregistrate, marcă de sănătate acolo unde se aplică.
                                    </p>
                                </div>
                            </ItemUp>

                            <ItemUp>
                                <div>
                                    <h3 className="font-bold text-farm-dark">4) Reziduuri de pesticide (MRL)</h3>
                                    <p className="mt-2">
                                        Fructele/legumele trebuie să respecte nivelurile maxime de reziduuri stabilite unitar în UE prin{" "}
                                        <a
                                            href="https://eur-lex.europa.eu/EN/legal-content/summary/pesticide-residues-in-food-and-animal-feed.html"
                                            className="underline text-farm-green"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            Regulamentul (CE) 396/2005
                                        </a>
                                        . MRL-ul general când nu există o limită specifică este 0,01 mg/kg.
                                    </p>
                                </div>
                            </ItemUp>

                            <ItemUp>
                                <div>
                                    <h3 className="font-bold text-farm-dark">5) Etichetare & informare corectă</h3>
                                    <p className="mt-2">
                                        Informațiile pentru consumatori (denumire, ingrediente, alergeni, origine unde e cazul) urmează{" "}
                                        <a
                                            href="https://anpc.ro/anpcftp/anpc_junior/regulament_1169_150218.pdf"
                                            className="underline text-farm-green"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            Regulamentul (UE) 1169/2011
                                        </a>
                                        . În piețe/târguri, pentru produse neambalate, trebuie afișate clar denumirea și originea.
                                    </p>
                                </div>
                            </ItemUp>

                            <ItemUp>
                                <div>
                                    <h3 className="font-bold text-farm-dark">6) „Bio/Organic” doar cu certificare</h3>
                                    <p className="mt-2">
                                        Termenii „ecologic/organic/bio” sunt protejați și se folosesc numai cu certificare conform{" "}
                                        <a
                                            href="https://eur-lex.europa.eu/eli/reg/2018/848/oj/eng"
                                            className="underline text-farm-green"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            Regulamentului (UE) 2018/848
                                        </a>
                                        . Caută logo-ul frunza-UE și codul organismului de control pe etichetă.
                                    </p>
                                </div>
                            </ItemUp>

                            <ItemUp>
                                <div>
                                    <h3 className="font-bold text-farm-dark">7) Înregistrare/Autorizare în România</h3>
                                    <p className="mt-2">
                                        În funcție de activitate (vânzare directă, procesare), producătorii se <strong>înregistrează</strong> sau
                                        <strong> autorizează</strong> sanitar-veterinar la DSVSA (sub ANSVSA). Detalii și formulare:
                                        {" "}
                                        <a
                                            href="https://www.ansvsa.ro/industrie-si-afaceri/autorizare-inregistrare-unitati-animal-non-animal/"
                                            className="underline text-farm-green"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            ANSVSA – înregistrare/autorizare unități
                                        </a>
                                        .
                                    </p>
                                </div>
                            </ItemUp>
                        </div>
                    </section>

                    {/* De ce să cumperi local */}
                    <section className="mt-12">
                        <FadeIn>
                            <h2 className="text-2xl md:text-3xl font-extrabold text-farm-dark">De ce să cumperi de la producători locali</h2>
                        </FadeIn>

                        <div className="mt-5 space-y-4 text-gray-700 max-w-4xl">
                            <ItemUp>
                                <p>
                                    <strong>Prospețime reală:</strong> lanț scurt de aprovizionare, timp mai mic între recoltare și consum.
                                </p>
                            </ItemUp>
                            <ItemUp>
                                <p>
                                    <strong>Sezon & gust:</strong> sortimente alese după sezon – mai multă aromă, mai puține depozitări îndelungate.
                                </p>
                            </ItemUp>
                            <ItemUp>
                                <p>
                                    <strong>Transparență:</strong> poți întreba direct cum s-au cultivat/obținut produsele; mulți producători
                                    comunică deschis despre tratamente, soiuri, practici.
                                </p>
                            </ItemUp>
                            <ItemUp>
                                <p>
                                    <strong>Impact local & mediu:</strong> susții fermele din zonă și reduci „food miles” și ambalajele inutile.
                                </p>
                            </ItemUp>
                            <ItemUp>
                                <p>
                                    <strong>Valoare pentru bani:</strong> plătești pentru produs, nu pentru intermedieri și marketing costisitor.
                                </p>
                            </ItemUp>
                        </div>
                    </section>

                    {/* Ce să verifici ca și cumpărător */}
                    <section className="mt-12">
                        <FadeIn>
                            <h2 className="text-2xl md:text-3xl font-extrabold text-farm-dark">Checklist rapid pentru cumpărători</h2>
                        </FadeIn>
                        <ul className="mt-5 space-y-3 text-gray-700 max-w-4xl list-disc pl-5">
                            <ItemUp>
                                <li>
                                    Caută <strong>informații clare</strong> (denumire, origine, alergeni). Pentru „bio”, verifică <strong>logo-ul UE</strong> și codul organismului de control.
                                </li>
                            </ItemUp>
                            <ItemUp>
                                <li>
                                    La produse de origine animală, verifică <strong>lanțul rece</strong> și, unde e cazul, <strong>marca de sănătate</strong>.
                                </li>
                            </ItemUp>
                            <ItemUp>
                                <li>
                                    Preferă <strong>sezonul</strong> și întreabă despre tratamente – producătorii serioși sunt transparenți.
                                </li>
                            </ItemUp>
                        </ul>

                        <Stagger>
                            <div className="card p-6 md:p-8 mt-8 flex items-center justify-between gap-4 flex-col sm:flex-row">
                                <p className="text-farm-dark font-semibold text-center sm:text-left">
                                    Gata să încerci o cutie locală?
                                </p>
                                <div className="flex gap-3">
                                    <Link to="/subscriptii" className="btn btn-primary">Vezi abonamentele</Link>
                                    <a
                                        href="/producatori-locali-timisoara"
                                        className="btn btn-outline"
                                    >
                                        Vezi producătorii
                                    </a>
                                </div>
                            </div>
                        </Stagger>
                    </section>

                    {/* Disclaimer */}
                    <section className="mt-6">
                        <p className="text-xs text-gray-500 max-w-4xl">
                            *Informațiile de pe această pagină sunt orientative și nu înlocuiesc obligația operatorilor de a verifica
                            cerințele legale actualizate la DSVSA/ANSVSA și în legislația UE.
                        </p>
                    </section>
                </section>
            </main>
        </>
    );
}
