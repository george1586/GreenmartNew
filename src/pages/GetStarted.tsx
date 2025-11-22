import { supabase } from "../lib/supabase";
import { Offer } from "../components/Offer";
import { Leaf, Users } from "lucide-react";
import { Option } from "../components/FreeOptions";
import { useEffect, useState } from "react";
import { footer } from "framer-motion/client";
import { Footer } from "../components/Footer";
import { createClient, User } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";

export function GetStarted() {
    const navigate = useNavigate();
    const [offer, setOffer] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => { if (!error) return; const t = setTimeout(() => setError(""), 4000); return () => clearTimeout(t); }, [error]);
    async function handleSubmit(e: React.FormEvent) {
        const table = "firstLeads";
        e.preventDefault();
        if (!email || !offer) {
            await setError("Alege oferta si introdu email-ul");
            return;
        };
        setLoading(true);
        try {
            const resp = await fetch(`${import.meta.env.VITE_SUPABASE_FUNCTIONS_URL}/auth-email-exists`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, table }),
            });
            if (resp.ok) {
                const check: { exists?: boolean, id?: string, completed_account?: boolean } = await resp.json();
                if (check.completed_account) { setError("Ai deja un cont pe aceasta adresa de email"); return; }
                if (check.exists) {
                    let id = check.id;
                    const resp = await fetch(`${import.meta.env.VITE_SUPABASE_FUNCTIONS_URL}/update-user`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ id, offer }),
                    });
                    navigate('/plans');
                }
                else {
                    const add_user = await fetch(`${import.meta.env.VITE_SUPABASE_FUNCTIONS_URL}/add-user`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email, table, offer }),
                    });
                    const text = await add_user.text();
                    console.log(text);
                    // navigate('/plans');
                }
            }
        }
        catch { };
        if (error) { console.log(error); }
    }

    return (
        <>
            <div className="flex flex-col">
                <Offer></Offer>
                <div className="flex flex-wrap items-center gap-2 mt-6 justify-center w-full">
                    <div className="flex items-center min-w-0">
                        <Leaf className="h-8 w-8 mr-1 min-w-0" aria-hidden="true" />
                        <span className="text-3xl font-bold text-farm-dark min-w-0 ">Green</span>
                        <span className="text-3xl font-bold text-farm-green min-w-0 ">Mart</span>
                    </div>
                </div>
                <div className="mt-6 flex flex-col items-center px-6 gap-4">
                    <h2 className="text-center font-bold text-3xl">Alege oferta gratuita</h2>
                    <h3 className="text-center font-bold text-gray-700 md:max-w-[50%] sm:max-w-[75%]">ULTIMA SANSA pentru oferta de iarna, inregistreaza-te pana pe 25/12 si alege GRATUIT dintr-un borcan de miere sau o sticla de sirop în prima cutie sau fursecuri gratuite pe viață.</h3>
                </div>
                <form action="/chooseOffer" onSubmit={handleSubmit} className="flex flex-col items-center justify-center gap-4 mt-12" method="post">
                    <div className="flex flex-wrap gap-4 mx-auto">
                        <Option header="Miere Gratuită în Prima Cutie" text="Primește un borcan de miere naturală, pură și ecologică, gratuit la prima ta comandă. Gust autentic și calitate superioară, direct din stupul local. Valoare 42 lei.﻿" image="https://hasxcndrhvtyjphntpft.supabase.co/storage/v1/object/public/images/mieredealbine.jpg" selected={offer === "Miere"} onSelect={() => setOffer("Miere")}></Option>
                        <Option header="Sirop Gratuit în Prima Cutie" text="Primește o sticlă de sirop natural, preparat din fructe locale, fără adaosuri artificiale, gratuit la prima ta comandă. Aromă pură și gust autentic. Valoare 35 lei.﻿" image="https://hasxcndrhvtyjphntpft.supabase.co/storage/v1/object/public/images/syrup.jpg" selected={offer === "Sirop"} onSelect={() => setOffer("Sirop")}></Option>
                        <Option header="Fursecuri Gratuite pe viață" text="Primește 200g de fursecuri artizanale, făcute cu ingrediente locale și naturale, gratuit la prima ta comandă. Gust autentic și calitate superioară. Valoare 300 lei.﻿" image="https://hasxcndrhvtyjphntpft.supabase.co/storage/v1/object/public/images/ChatGPT%20Image%20Nov%2017,%202025,%2002_09_51%20PM(1).png" selected={offer === "Fursecuri"} onSelect={() => setOffer("Fursecuri")}></Option>
                    </div>
                    <div className="mt-4">
                        <div className="flex flex-wrap gap-4 justify-center">
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-[0.5*vdw] h-25 border px-3 py-1 transition-colors duration-150 ${email ? 'border-farm-green' : 'border-gray-300'} focus:border-farm-green focus:ring-2 focus:ring-farm-green/30 focus:outline-none"
                            />

                            <button type="submit" disabled={loading}
                                className="btn btn-primary">
                                ADAUGA OFERTA IN COS
                            </button>
                        </div>
                        <p className={`text-red-700 text-center ${error ? "display-none" : "display-block"}`}>{error}</p>
                        <p className="mt-6 mb-16 mx-[10%] text-xs sm:mx-[20%] text-gray-500 leading-6 text-center">
                            Alege gratuit dintre miere sau sirop pentru prima ta comandă Greenmart sau fursecuri grauit pe toată durata abonamentului. Oferta este valabilă exclusiv pentru membrii noi și nu poate fi combinată cu nicio altă promoție. Oferta este disponibilă până pe 25.12.2025 sau până la epuizarea stocului. Greenmart își rezervă dreptul de a anula această ofertă oricând, la propria discreție, sau de a o înlocui cu altă promoție. Prin introducerea adresei de email mai sus, esti de acord să primesc emailuri de marketing de la Greenmart și partenerii săi. Te poti dezabona oricând. Consultă <a href="/termeni" className="text-farm-green">Termenii și condițiile</a> pentru mai multe detalii.                            </p>
                    </div>
                </form >
            </div >
            <Footer></Footer>
        </>
    )
}
