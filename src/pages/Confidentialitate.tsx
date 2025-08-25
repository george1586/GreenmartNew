import { Header } from "../components/Header";
export function Confidentialitate() {
    return (
        <>
            <Header />
            <main className="max-w-4xl mx-auto px-6 py-12 text-gray-800">
                <h1 className="text-3xl font-bold mb-2">Politica de Confidențialitate – Greenmart</h1>
                <p className="text-gray-600 mb-8">Ultima actualizare: 26 august 2025</p>

                <p className="mb-6">
                    Această politică explică modul în care <strong>SC GREENMART SRL</strong> („Greenmart”, „noi”)
                    colectează, folosește, stochează și protejează datele tale cu caracter personal atunci când
                    folosești platforma noastră, plasezi comenzi sau interacționezi cu noi. Prelucrăm datele în
                    conformitate cu Regulamentul (UE) 2016/679 („GDPR”) și legislația română aplicabilă.
                </p>

                <h2 className="text-xl font-semibold mt-8 mb-3">1. Cine suntem și cum ne poți contacta</h2>
                <p className="mb-6">
                    Operator de date: <strong>SC GREENMART SRL</strong><br />
                    Sediu: Timișoara, România<br />
                    Email suport: <a className="text-green-600" href="mailto:greenmart@writeme.com">greenmart@writeme.com</a><br />
                    (Opțional) Responsabil cu Protecția Datelor (DPO): <em>completați dacă desemnați unul</em>
                </p>

                <h2 className="text-xl font-semibold mt-8 mb-3">2. Ce date colectăm</h2>
                <ul className="list-disc ml-6 space-y-2 mb-6">
                    <li><strong>Date de cont</strong>: nume, email, parolă (hash), telefon (dacă îl oferi).</li>
                    <li><strong>Date de comandă și livrare</strong>: adresă, tip box, preferințe, istoric comenzi.</li>
                    <li><strong>Date de plată</strong>: sunt procesate de furnizorul nostru de plăți (Stripe); noi nu stocăm numerele cardurilor.</li>
                    <li><strong>Comunicare</strong>: mesajele tale (formular contact, email), feedback, review-uri.</li>
                    <li><strong>Date tehnice</strong>: loguri, IP, tip dispozitiv, evenimente de autentificare (prin Supabase).</li>
                    <li><strong>Cookie-uri și tehnologii similare</strong>: pentru funcționare, analiză, preferințe (vezi secțiunea Cookies).</li>
                </ul>

                <h2 className="text-xl font-semibold mt-8 mb-3">3. Temeiuri legale și scopuri</h2>
                <div className="overflow-hidden rounded-2xl border mb-6">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="text-left p-3">Scop</th>
                                <th className="text-left p-3">Date</th>
                                <th className="text-left p-3">Temei legal</th>
                            </tr>
                        </thead>
                        <tbody className="[&>tr:nth-child(odd)]:bg-white [&>tr:nth-child(even)]:bg-gray-50">
                            <tr>
                                <td className="p-3">Creare și administrare cont</td>
                                <td className="p-3">Nume, email, parolă</td>
                                <td className="p-3">Art. 6(1)(b) GDPR – executarea contractului</td>
                            </tr>
                            <tr>
                                <td className="p-3">Procesarea comenzilor și livrare</td>
                                <td className="p-3">Date de livrare, comenzi</td>
                                <td className="p-3">Art. 6(1)(b) GDPR</td>
                            </tr>
                            <tr>
                                <td className="p-3">Plăți și facturare</td>
                                <td className="p-3">Date tranzacționale (prin Stripe)</td>
                                <td className="p-3">Art. 6(1)(b) și 6(1)(c) GDPR (obligații fiscale)</td>
                            </tr>
                            <tr>
                                <td className="p-3">Comunicări operaționale (emailuri de confirmare, resetare parolă)</td>
                                <td className="p-3">Email, nume</td>
                                <td className="p-3">Art. 6(1)(b) GDPR</td>
                            </tr>
                            <tr>
                                <td className="p-3">Marketing (newsletter, oferte)</td>
                                <td className="p-3">Email, preferințe</td>
                                <td className="p-3">Art. 6(1)(a) GDPR – consimțământ (te poți dezabona oricând)</td>
                            </tr>
                            <tr>
                                <td className="p-3">Securitate și prevenirea abuzurilor</td>
                                <td className="p-3">Loguri, IP, evenimente</td>
                                <td className="p-3">Art. 6(1)(f) GDPR – interes legitim</td>
                            </tr>
                            <tr>
                                <td className="p-3">Conformitate legală</td>
                                <td className="p-3">Date fiscale/contabile</td>
                                <td className="p-3">Art. 6(1)(c) GDPR</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <h2 className="text-xl font-semibold mt-8 mb-3">4. Destinatari și împuterniciți</h2>
                <p className="mb-3">
                    Partajăm datele doar cu furnizori esențiali pentru a-ți livra serviciul, în baza unor
                    acorduri de prelucrare:
                </p>
                <ul className="list-disc ml-6 space-y-2 mb-6">
                    <li><strong>Supabase</strong> – autentificare, baze de date, funcții edge.</li>
                    <li><strong>Stripe</strong> – procesare plăți și facturare (tokenizare card).</li>
                    <li><strong>Brevo (Sendinblue)</strong> – trimitere emailuri tranzacționale/marketing.</li>
                    <li><strong>Infrastructură de hosting/CDN</strong> (ex.: Vercel) – livrare conținut și performanță.</li>
                    <li>Curieri/servicii logistice locale – exclusiv pentru livrări în Timișoara.</li>
                    <li>Consultanți (juridic/contabilitate) – doar unde este necesar și legal.</li>
                </ul>
                <p className="mb-6">
                    Nu vindem datele tale. Transferurile în afara SEE, dacă apar, se fac cu garanții GDPR
                    (clauze contractuale standard, măsuri suplimentare tehnice/organizatorice).
                </p>

                <h2 className="text-xl font-semibold mt-8 mb-3">5. Păstrarea datelor</h2>
                <ul className="list-disc ml-6 space-y-2 mb-6">
                    <li>Cont și comenzi: pe durata utilizării serviciului și încă maximum 3 ani după, pentru apărarea drepturilor.</li>
                    <li>Documente contabile: conform legii, de regulă 5–10 ani.</li>
                    <li>Marketing: până la retragerea consimțământului sau 24 luni de inactivitate.</li>
                    <li>Loguri de securitate: 6–24 luni, în funcție de risc.</li>
                </ul>

                <h2 className="text-xl font-semibold mt-8 mb-3">6. Securitate</h2>
                <p className="mb-6">
                    Aplicăm măsuri tehnice și organizatorice rezonabile: criptare în tranzit, controale de acces,
                    jurnalizare evenimente, back‑up, principiu „need to know”. Nicio platformă nu poate garanta
                    securitate absolută; ne angajăm să notificăm fără întârzieri nejustificate incidentele grave,
                    conform legii.
                </p>

                <h2 className="text-xl font-semibold mt-8 mb-3">7. Drepturile tale (GDPR)</h2>
                <ul className="list-disc ml-6 space-y-2 mb-6">
                    <li>Dreptul de acces la date</li>
                    <li>Dreptul la rectificare</li>
                    <li>Dreptul la ștergere („dreptul de a fi uitat”)</li>
                    <li>Dreptul la restricționare</li>
                    <li>Dreptul la portabilitate</li>
                    <li>Dreptul la opoziție (inclusiv marketing direct)</li>
                    <li>Dreptul de a-ți retrage consimțământul (când temeiul e consimțământul)</li>
                    <li>Dreptul de a depune plângere la ANSPDCP</li>
                </ul>
                <p className="mb-6">
                    Pentru exercitarea drepturilor, scrie-ne la{" "}
                    <a className="text-green-600" href="mailto:greenmart@writeme.com">greenmart@writeme.com</a>.
                    Vom răspunde în maximum 30 de zile.
                </p>

                <h2 className="text-xl font-semibold mt-8 mb-3">8. Cookie-uri și tehnologii similare</h2>
                <p className="mb-3">
                    Folosim cookie-uri necesare pentru funcționare, precum și (opțional) cookie-uri de analiză și
                    personalizare. Îți poți gestiona preferințele din bannerul de consimțământ sau din setările
                    browserului. Unele funcționalități pot fi afectate dacă dezactivezi cookie-urile.
                </p>
                <p className="mb-6">
                    (Opțional) Poți revizita preferințele aici:{" "}
                    <button className="underline text-green-600" onClick={() => (window as any).openCookiePreferences?.()}>
                        Deschide preferințe cookie
                    </button>
                    .
                </p>

                <h2 className="text-xl font-semibold mt-8 mb-3">9. Copii</h2>
                <p className="mb-6">
                    Serviciile noastre se adresează persoanelor de 18+ ani. Nu colectăm intenționat date ale minorilor.
                    Dacă ai motive să crezi că un minor ne-a furnizat date, contactează-ne pentru a le șterge.
                </p>

                <h2 className="text-xl font-semibold mt-8 mb-3">10. Modificări ale politicii</h2>
                <p className="mb-6">
                    Putem actualiza această politică periodic pentru a reflecta schimbări legislative sau operaționale.
                    Versiunea curentă este publicată pe această pagină și se aplică de la data afișată mai sus.
                </p>

                <h2 className="text-xl font-semibold mt-8 mb-3">11. Contact</h2>
                <p className="mb-2">
                    Pentru întrebări privind confidențialitatea:{" "}
                    <a className="text-green-600" href="mailto:greenmart@writeme.com">greenmart@writeme.com</a>
                </p>
            </main>
        </>
    );
}
