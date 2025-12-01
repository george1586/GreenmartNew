import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Footer } from "../components/Footer";
import { Option } from "../components/FreeOptions";
import { Leaf } from "lucide-react";
import { Offer } from "../components/Offer";
import { useSession } from "../hooks/useSession";

export function Plans() {
    const location = useLocation();
    const navigate = useNavigate();
    const [plan, setPlan] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const { updateSession, checkSession } = useSession();
    useEffect(() => { if (!error) return; const t = setTimeout(() => setError(""), 4000); return () => clearTimeout(t); }, [error]);
    async function handleSubmit(e: React.FormEvent) {
        setLoading(true);
        e.preventDefault();
        try {
            if (!plan) {
                setError("Alege un plan");
                setLoading(false);
                return;
            }
            updateSession({ plan: plan });
            navigate("/delivery-and-size");
        }
        catch (error) {
            setLoading(false);
            throw error;
        }
    }

    const userId = location.state?.userId;
    console.log(userId);
    useEffect(() => {
        const userId = location.state?.userId;
        if (!checkSession(['offer', 'email'])) {
            navigate("/get-started");
            return;
        }
        if (!userId) {
            navigate("/get-started");
        }
    }, [checkSession, userId, navigate]);

    if (!userId) return null;

    return (<>
        <div className="flex flex-col mb-16">
            <Offer></Offer>
            <div className="flex flex-wrap items-center gap-2 mt-6 justify-center w-full">
                <div className="flex items-center min-w-0">
                    <Leaf className="h-8 w-8 mr-1 min-w-0" aria-hidden="true" />
                    <span className="text-3xl font-bold text-farm-dark min-w-0 ">Green</span>
                    <span className="text-3xl font-bold text-farm-green min-w-0 ">Mart</span>
                </div>
            </div>
            <div className="mt-6 flex flex-col items-center px-6 gap-4">
                <h2 className="text-center font-bold text-3xl">Alege un plan</h2>
                <h3 className="text-center font-bold text-gray-700 md:max-w-[50%] sm:max-w-[75%]">Alege produsele pe care vrei sa le primesti sau lasa-ne pe noi sa alegem pentru tine. Oricum ar fi,vei primi produse fresh si sanatoase, economisind timp si bani</h3>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center gap-4 mt-12" method="post">
                <div className="flex flex-wrap gap-4 mx-auto">
                    <Option header="Plan Customizat" alt="" text="Alege din toata selectia noastra de produse. Doua marimi disponibile, contine cu 20% mai mult decat Planul Nostru.﻿" image="" selected={plan === "Custom"} onSelect={() => setPlan("Custom")}></Option>
                    <Option header="Planul Nostru" alt="" text="Alege tipul tau favorit de produse si noi vom alege o selectie potrivita si diversificata de fiecare data. Doua marimi disponibile.﻿" image="" selected={plan === "Currated"} onSelect={() => setPlan("Currated")}></Option>
                </div>
                <div className="mt-4">
                    <div className="flex flex-wrap gap-4 justify-center">
                        <button type="submit" disabled={loading}
                            className="btn btn-primary">
                            ALEGE MARIMEA CUTIEI
                        </button>
                    </div>
                </div>
                <p className={`text-red-700 text-center ${error ? "display-none" : "display-block"}`}>{error}</p>
            </form >
        </div >
        <Footer></Footer>
    </>
    )
}
