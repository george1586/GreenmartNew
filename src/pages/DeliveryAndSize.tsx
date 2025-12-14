import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Footer } from "../components/Footer";
import { Offer } from "../components/Offer";
import { Header } from "../components/Header";
import { Container } from "../components/ui/Container";
import { Button } from "../components/ui/Button";
import { SelectionCard } from "../components/ui/SelectionCard";
import { ArrowRight, Calendar, Box, Loader2 } from "lucide-react";
import { getSession } from "../hooks/getSession";
import { getPriceId } from "../lib/prices";

type DeliveryFrequency = "saptamanal" | "bisaptamanal" | "lunar";
type BoxSize = "Medie" | "Mare";

export function DeliveryAndSize() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [verifying, setVerifying] = useState(true);
    const [error, setError] = useState("");
    
    // State
    const [freq, setFreq] = useState<DeliveryFrequency | "">("");
    const [size, setSize] = useState<BoxSize | "">("");
    const [planType, setPlanType] = useState<string>("");

    useEffect(() => {
        async function init() {
            try {
                const session = await getSession();
                if (!session || !session.plan) {
                    // navigate("/plans"); // Redirect if no plan selected
                    // For dev/testing maybe just warn? prefer redirect.
                }
                if (session?.plan) setPlanType(session.plan);
                if (session?.freq) setFreq(session.freq as DeliveryFrequency);
                if (session?.size) setSize(session.size as BoxSize);
            } catch (err) {
                console.error("Failed to load session", err);
            } finally {
                setVerifying(false);
            }
        }
        init();
    }, [navigate]);

    async function handleContinue() {
        if (!freq || !size) {
            setError("Te rugăm să selectezi mărimea și frecvența livrării.");
            return;
        }
        setLoading(true);
        setError("");

        try {
            // 1. Update Session
            const updateRes = await fetch(`${import.meta.env.VITE_SUPABASE_FUNCTIONS_URL}/session`, {
                method: "PATCH",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ freq, size }),
            });
            
            if (!updateRes.ok) throw new Error("Failed to update session");

            // 2. Route based on Plan Type
            if (planType === "Custom") {
                navigate("/custom-plan");
            } else {
                // Curated Plan -> Checkout directly
                await handleCheckout();
            }

        } catch (err) {
            console.error(err);
            setError("A apărut o eroare. Te rugăm să încerci din nou.");
            setLoading(false);
        }
    }

    async function handleCheckout() {
        try {
            const session = await getSession();
            const customerEmail = session.email;
            
            // Call create-checkout-session
            const fnUrl = (import.meta.env.VITE_SUPABASE_FUNCTIONS_URL as string) || "https://hasxcndrhvtyjphntpft.functions.supabase.co";
            
            // Calculate Price ID
            const priceId = getPriceId(planType, size);
            
            console.log("Checking out with:", { planType, size, priceId }); // Debug log

            if (!priceId) {
                throw new Error("Configuration Error: Missing Stripe Price ID for this selection. Please check .env variables.");
            }

            const res = await fetch(`${fnUrl}/create-checkout-session`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "x-stripe-mode": import.meta.env.VITE_APP_MODE || "live",
                    "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
                },
                body: JSON.stringify({
                    priceId,
                    customerEmail,
                    offer: session.offer || localStorage.getItem("greenmart_offer"),   // <--- Backup
                    cartSummary: "Standard Curated Box", 
                    success_url: `${window.location.origin}/thank-you`,
                    cancel_url: `${window.location.origin}/delivery-and-size`, 
                }),
            });

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.error || `Server error: ${res.status}`);
            }
            
            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                throw new Error("No checkout URL returned from server.");
            }
        } catch (err: any) {
            console.error("Checkout Error:", err);
            // Show the actual error message to the user for debugging
            setError(err.message || "A apărut o eroare. Te rugăm să încerci din nou."); 
            setLoading(false);
            // Re-throw if you want to bubble up, but we handled UI here.
        }
    }

    if (verifying) return <div className="min-h-screen grid place-items-center"><Loader2 className="animate-spin h-8 w-8 text-farm-green" /></div>;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Offer />
            <Header />

            <main className="flex-grow py-12 px-4">
                <Container className="max-w-4xl">
                    <div className="text-center mb-10">
                        <span className="text-farm-green font-bold tracking-wider text-sm uppercase mb-2 block">Pasul 3 din 4</span>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-farm-dark mb-4">
                            Configurează Livrarea
                        </h1>
                        <p className="text-lg text-gray-600">
                            Alege mărimea potrivită pentru tine și cât de des vrei să o primești.
                        </p>
                    </div>

                    <div className="space-y-12">
                        {/* SIZE SELECTION */}
                        <section>
                            <div className="flex items-center gap-2 mb-6 text-xl font-bold text-farm-dark">
                                <Box className="h-6 w-6 text-farm-green" />
                                <h2>1. Alege Mărimea Cutiei</h2>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <SelectionCard
                                    title="Cutie Medie"
                                    description="Ideală pentru 1-2 persoane. Conține esențialul de legume și fructe pentru o săptămână."
                                    price="96 Ron"
                                    details="3-5 kg produse"
                                    selected={size === "Medie"}
                                    onSelect={() => setSize("Medie")}
                                    image="/images/medium-box.png"
                                />
                                <SelectionCard
                                    title="Cutie Mare"
                                    description="Perfectă pentru familii (3-4 persoane). Varietate mai mare și cantități generoase."
                                    price="179 Ron"
                                    details="7-10 kg produse"
                                    selected={size === "Mare"}
                                    onSelect={() => setSize("Mare")}
                                     image="/images/large-box.png"
                                />
                            </div>
                        </section>

                        {/* FREQUENCY SELECTION */}
                        <section>
                             <div className="flex items-center gap-2 mb-6 text-xl font-bold text-farm-dark">
                                <Calendar className="h-6 w-6 text-farm-green" />
                                <h2>2. Alege Frecvența</h2>
                            </div>
                            <div className="grid md:grid-cols-3 gap-4">
                                <SelectionCard
                                    title="Săptămânal"
                                    description="Primești o cutie proaspătă în fiecare săptămână."
                                    selected={freq === "saptamanal"}
                                    onSelect={() => setFreq("saptamanal")}
                                />
                                <SelectionCard
                                    title="La 2 Săptămâni"
                                    description="Livrare o dată la două săptămâni."
                                    selected={freq === "bisaptamanal"}
                                    onSelect={() => setFreq("bisaptamanal")}
                                />
                                <SelectionCard
                                    title="Lunar"
                                    description="Livrare o dată pe lună."
                                    selected={freq === "lunar"}
                                    onSelect={() => setFreq("lunar")}
                                />
                            </div>
                             <p className="text-sm text-gray-500 mt-4 text-center italic">
                                * Poți modifica frecvența, pune pauză sau anula oricând din contul tău.
                            </p>
                        </section>

                        <div className="flex flex-col items-center gap-4 pt-8">
                             <Button 
                                onClick={handleContinue}
                                disabled={loading}
                                size="lg"
                                className="w-full md:w-auto min-w-[300px] text-lg shadow-xl"
                            >
                                {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin"/>}
                                {planType === "Custom" ? "Alege Produsele" : "Finalizează Comanda"} 
                                {!loading && <ArrowRight className="ml-2 h-5 w-5" />}
                            </Button>
                             {error && (
                                <p className="text-red-600 font-medium bg-red-50 px-4 py-2 rounded-lg">{error}</p>
                            )}
                        </div>
                    </div>
                </Container>
            </main>
            <Footer />
        </div>
    );
}