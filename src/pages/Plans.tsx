import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Footer } from "../components/Footer";
import { Option } from "../components/FreeOptions";
import { Leaf } from "lucide-react";
import { Offer } from "../components/Offer";

type SessionField = "anonymous" | "userId" | "email" | "size" | "freq" | "offer" | "plan";

const SESSION_BASE_URL = import.meta.env.VITE_SUPABASE_FUNCTIONS_URL;

async function updateSessionOnServer(patch: Partial<Record<SessionField, unknown>>) {
    const res = await fetch(`${SESSION_BASE_URL}/session`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
    });
    if (!res.ok) {
        throw new Error(`Failed to update session: ${res.status}`);
    }
    return res.json();
}

async function checkSessionOnServer(requiredFields: SessionField[]): Promise<boolean> {
    const res = await fetch(`${SESSION_BASE_URL}/session/check`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requiredFields }),
    });
    if (!res.ok) {
        throw new Error(`Failed to check session: ${res.status}`);
    }
    const data = await res.json();
    return Boolean(data.valid);
}

export function Plans() {
    const location = useLocation();
    const navigate = useNavigate();

    const [plan, setPlan] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!error) return;
        const t = setTimeout(() => setError(""), 4000);
        return () => clearTimeout(t);
    }, [error]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!plan) {
            setError("Alege un plan");
            return;
        }

        setLoading(true);
        try {
            await updateSessionOnServer({ plan });

            navigate("/delivery-and-size");
        } catch (err) {
            console.error("Failed to update session", err);
            setError("A apărut o problemă, încearcă din nou.");
        } finally {
            setLoading(false);
        }
    }

    const userId = location.state?.userId;

    useEffect(() => {
        let cancelled = false;

        async function guardRoute() {
            try {
                const isValid = await checkSessionOnServer(["offer", "email"]);
                if (cancelled) return;

                if (!isValid) {
                    navigate("/get-started");
                    return;
                }

                if (!userId) {
                    navigate("/get-started");
                }
            } catch (err) {
                console.error("Failed to check session", err);
                if (!cancelled) {
                    navigate("/get-started");
                }
            }
        }

        guardRoute();
        return () => {
            cancelled = true;
        };
    }, [userId, navigate]);

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
                <p className={`text - red - 700 text - center ${error ? "display-none" : "display-block"}`}>{error}</p>
            </form >
        </div >
        <Footer></Footer>
    </>
    )
}
