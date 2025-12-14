import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Footer } from "../components/Footer";
import { Offer } from "../components/Offer";
import { Container } from "../components/ui/Container";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Leaf, Package, UserCheck, ArrowRight, Check } from "lucide-react";
import { Header } from "../components/Header"; // Assuming we want the header here too, or just the unified layout

type SessionField = "anonymous" | "userId" | "email" | "size" | "freq" | "offer" | "plan";
const SESSION_BASE_URL = import.meta.env.VITE_SUPABASE_FUNCTIONS_URL;

async function updateSessionOnServer(patch: Partial<Record<SessionField, unknown>>) {
    const res = await fetch(`${SESSION_BASE_URL}/session`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
    });
    if (!res.ok) throw new Error(`Failed to update session: ${res.status}`);
    return res.json();
}

async function checkSessionOnServer(requiredFields: SessionField[]): Promise<boolean> {
    const res = await fetch(`${SESSION_BASE_URL}/session/check`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requiredFields }),
    });
    if (!res.ok) throw new Error(`Failed to check session: ${res.status}`);
    const data = await res.json();
    return Boolean(data.valid);
}

// Plan Option Component
function PlanCard({ 
    title, 
    subtitle, 
    description, 
    features, 
    icon: Icon, 
    selected, 
    onSelect 
}: { 
    title: string, 
    subtitle: string, 
    description: string, 
    features: string[], 
    icon: React.ElementType, 
    selected: boolean, 
    onSelect: () => void 
}) {
    return (
        <div 
            onClick={onSelect}
            className={`
                cursor-pointer group relative flex flex-col h-full rounded-2xl border-2 p-6 transition-all duration-300
                ${selected 
                    ? "border-farm-green bg-farm-light/20 shadow-xl scale-[1.02]" 
                    : "border-gray-100 bg-white hover:border-farm-green/40 hover:shadow-lg"
                }
            `}
        >
            {selected && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-farm-green text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-md">
                    Selectat
                </div>
            )}
            
            <div className="flex items-center gap-4 mb-4">
                <div className={`p-3 rounded-xl ${selected ? "bg-farm-green text-white" : "bg-farm-green/10 text-farm-green group-hover:bg-farm-green group-hover:text-white"} transition-colors`}>
                    <Icon className="h-8 w-8" />
                </div>
                <div>
                   <h3 className="text-xl font-bold text-farm-dark">{title}</h3>
                   <p className="text-sm font-semibold text-farm-green">{subtitle}</p>
                </div>
            </div>
            
            <p className="text-gray-600 mb-6 leading-relaxed flex-grow">
                {description}
            </p>
            
            <div className="space-y-3 mb-8">
                {features.map((f, i) => (
                    <div key={i} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-farm-green shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">{f}</span>
                    </div>
                ))}
            </div>
            
            <div className={`w-full py-3 rounded-xl text-center font-bold text-sm transition-colors border-2 ${selected ? "bg-farm-green text-white border-farm-green" : "bg-white text-gray-600 border-gray-200 group-hover:border-farm-green group-hover:text-farm-green"}`}>
                {selected ? "Plan Selectat" : "Alege acest plan"}
            </div>
        </div>
    )
}

export function Plans() {
    const location = useLocation();
    const navigate = useNavigate();

    const [plan, setPlan] = useState<"Custom" | "Currated" | "">("");
    const [loading, setLoading] = useState(false);
    const [verifying, setVerifying] = useState(true);
    const [error, setError] = useState("");

    const userId = location.state?.userId;

    // Check session
    useEffect(() => {
        let cancelled = false;
        async function guard() {
            try {
                // If we have userId in state, we assume we came from GetStarted successfully.
                // But double check server session:
                const isValid = await checkSessionOnServer(["offer", "email"]); // relaxed check
                if (cancelled) return;
                if (!isValid && !userId) {
                    navigate("/get-started"); // redirect back if session lost
                }
            } catch (err) {
               console.error(err);
               // navigate("/get-started"); // optional strictness
            } finally {
               setVerifying(false);
            }
        }
        guard();
        return () => { cancelled = true; };
    }, [userId, navigate]);

    async function handleContinue() {
        if (!plan) {
            setError("Te rugăm să alegi un tip de cutie.");
            return;
        }
        setLoading(true);
        try {
            await updateSessionOnServer({ plan });
            navigate("/delivery-and-size");
        } catch (err) {
            console.error("Failed to update session", err);
            setError("A apărut o eroare. Încearcă din nou.");
            setLoading(false);
        }
    }

    if (verifying) return <div className="min-h-screen grid place-items-center"><div className="animate-spin h-8 w-8 border-4 border-farm-green border-t-transparent rounded-full"></div></div>;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Offer />
            <Header />

            <main className="flex-grow py-12 px-4">
                <Container className="max-w-5xl">
                    <div className="text-center mb-10 md:mb-16">
                         <span className="text-farm-green font-bold tracking-wider text-sm uppercase mb-2 block">Pasul 2 din 4</span>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-farm-dark mb-4">
                            Cum vrei să primești bunătățile?
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Poți alege produsele exact cum vrei tu, sau ne poți lăsa pe noi să te surprindem cu o selecție de sezon.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-10">
                        <PlanCard 
                            title="Cutia Custom"
                            subtitle="Alegi tu produsele"
                            description="Perfect dacă știi exact ce gătești. Primești acces la tot inventarul nostru și îți compui cutia după bunul plac."
                            features={[
                                "Acces complet la magazinul online",
                                "Tu alegi fiecare produs în parte",
                                "Conține cu 20% mai mult decât standard",
                                "Ideal pentru meal-planning specific"
                            ]}
                            icon={UserCheck}
                            selected={plan === "Custom"}
                            onSelect={() => setPlan("Custom")}
                        />
                         <PlanCard 
                            title="Cutia Green"
                            subtitle="Alegem noi pentru tine"
                            description="Lasă greul pe noi. Îți construim o cutie echilibrată cu cele mai bune legume și fructe de sezon disponibile."
                            features={[
                                "Economisești timp (fără browsing)",
                                "Descoperi produse noi și diverse",
                                "Calitate verificată și prospețime maximă",
                                "Ideal pentru diversitate în dietă"
                            ]}
                            icon={Package}
                            selected={plan === "Currated"}
                            onSelect={() => setPlan("Currated")}
                        />
                    </div>
                    
                    <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 md:static md:bg-transparent md:border-t-0 flex justify-center z-20">
                         <Button 
                            onClick={handleContinue}
                            disabled={!plan || loading}
                            size="lg"
                            className="w-full md:w-auto min-w-[300px] text-lg shadow-xl"
                        >
                            Pasul Următor <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </div>
                     {error && (
                        <p className="text-center text-red-600 mt-4 font-medium animate-pulse">{error}</p>
                    )}

                </Container>
            </main>
            <Footer />
        </div>
    )
}
