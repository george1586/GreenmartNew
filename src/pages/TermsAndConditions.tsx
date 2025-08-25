import { Header } from "../components/Header";

export function TermsAndConditions() {
    return (
        <>
            <Header />
            <main className="max-w-4xl mx-auto px-6 py-12 text-gray-800">
                <h1 className="text-3xl font-bold mb-6">Termeni și Condiții Generale – Greenmart</h1>

                <p className="mb-6">
                    Acești termeni și condiții reglementează utilizarea platformei Greenmart
                    (denumită în continuare „Platforma”) și a serviciilor furnizate de către
                    <strong>SC GREENMART SRL</strong> (denumit în continuare „Furnizorul”),
                    având ca obiect livrarea săptămânală de cutii alimentare (denumite „Boxuri”)
                    pe bază de abonament, către persoane fizice domiciliate în România.
                </p>
                <p className="mb-6">
                    Prin crearea unui cont, accesarea Platformei sau plasarea unei comenzi,
                    utilizatorul (denumit în continuare „Clientul”) declară că a citit, înțeles
                    și acceptat integral acești termeni.
                </p>

                <h2 className="text-xl font-semibold mt-8 mb-3">1. Descrierea serviciului</h2>
                <p className="mb-6">
                    Greenmart oferă un serviciu de livrare săptămânală a unor Boxuri predefinite,
                    conținând produse alimentare perisabile (legume, verdețuri, produse artizanale etc.),
                    alese de echipa Greenmart pe baza disponibilității sezoniere și a parteneriatelor
                    cu producători locali. Boxurile pot conține și produse de calitatea a doua,
                    care, deși perfect comestibile și sigure, prezintă imperfecțiuni estetice
                    (forme neregulate, dimensiuni variate etc.), fără a afecta siguranța alimentară.
                    Compoziția Boxurilor poate varia de la o săptămână la alta, în funcție de
                    sezonalitate și stoc, fără notificare prealabilă.
                </p>

                <h2 className="text-xl font-semibold mt-8 mb-3">2. Abonamente</h2>
                <p className="mb-6">
                    Serviciul este disponibil exclusiv pe bază de abonament săptămânal, cu plata recurentă.
                    Abonamentul este activ imediat după confirmarea plății și este valabil până la momentul
                    dezabonării de către Client. Anularea unui abonament se aplică doar pentru livrările viitoare.
                    Comenzile deja procesate și plătite nu pot fi anulate sau rambursate. Clientul este responsabil
                    să gestioneze abonamentul din contul său sau să solicite suport prin email, cu cel puțin
                    3 zile lucrătoare înainte de următoarea livrare.
                </p>

                <h2 className="text-xl font-semibold mt-8 mb-3">3. Livrare și neridicare</h2>
                <p className="mb-6">
                    Livrările se efectuează în zona Timișoara, în ziua și intervalul stabilit de Greenmart
                    și comunicat în prealabil. Dacă livrarea nu poate fi efectuată din culpa Clientului,
                    iar curierul nu este recontactat în termen de 2 ore, comanda va fi lăsată la adresă
                    (dacă există condiții minime de siguranță) sau va fi donată unei cauze sociale locale.
                    În aceste cazuri, nu se oferă rambursare sau înlocuire.
                </p>

                <h2 className="text-xl font-semibold mt-8 mb-3">4. Răspundere și reclamații</h2>
                <p className="mb-6">
                    Orice sesizare privind produse neconforme trebuie transmisă în termen de 24h de la
                    recepționarea comenzii, însoțită de dovezi foto, la {" "}
                    <a href="mailto:greenmart@writeme.com" className="text-green-600 font-medium">
                        greenmart@writeme.com
                    </a>. Produsele perisabile nu pot fi returnate. În cazuri justificate, se poate oferi
                    un credit valoric pentru comenzile viitoare sau restituire parțială.
                </p>

                <h2 className="text-xl font-semibold mt-8 mb-3">5. Drepturi de autor și conținut</h2>
                <p className="mb-6">
                    Toate materialele de pe platforma Greenmart (denumiri, texte, fotografii, rețete, planuri alimentare)
                    sunt protejate de drepturile de autor. Reproducerea sau distribuirea fără acordul scris al
                    Furnizorului este interzisă.
                </p>

                <h2 className="text-xl font-semibold mt-8 mb-3">6. Protecția datelor</h2>
                <p className="mb-6">
                    Datele colectate sunt utilizate exclusiv pentru procesarea comenzilor și comunicare.
                    Greenmart respectă legislația GDPR și nu transmite datele tale către terți fără consimțământ.
                </p>

                <h2 className="text-xl font-semibold mt-8 mb-3">7. Limitarea răspunderii</h2>
                <p className="mb-6">
                    Greenmart nu este responsabil pentru întârzieri externe (trafic, vreme),
                    incompatibilități alergene sau utilizarea necorespunzătoare a produselor.
                </p>

                <h2 className="text-xl font-semibold mt-8 mb-3">8. Forța majoră</h2>
                <p className="mb-6">
                    Greenmart nu poate fi ținut responsabil pentru neexecutarea obligațiilor contractuale
                    în cazuri de forță majoră: pandemii, restricții, catastrofe naturale etc.
                </p>

                <h2 className="text-xl font-semibold mt-8 mb-3">9. Modificări</h2>
                <p className="mb-6">
                    Ne rezervăm dreptul de a modifica acești termeni fără notificare prealabilă.
                    Versiunea actualizată se aplică automat comenzilor viitoare.
                </p>

                <h2 className="text-xl font-semibold mt-8 mb-3">10. Contact</h2>
                <p>
                    Pentru întrebări sau sesizări:{" "}
                    <a href="mailto:greenmart@writeme.com" className="text-green-600 font-medium">
                        greenmart@writeme.com
                    </a>
                </p>

                <p className="mt-8 font-medium">
                    Prin utilizarea serviciului Greenmart, Clientul confirmă că a citit, înțeles și acceptat integral acești termeni.
                </p>
            </main>
        </>
    )
}
