import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Offer } from "../components/Offer";
import { Footer } from "../components/Footer";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Container } from "../components/ui/Container";
import { Leaf, Gift, Check } from "lucide-react";

// Wrapper for the Option to be cleaner
function SelectableOption({ title, description, image, selected, onSelect }: { title: string, description: string, image?: string, selected: boolean, onSelect: () => void }) {
    return (
        <div 
            onClick={onSelect}
            className={`
                cursor-pointer group relative overflow-hidden rounded-2xl border-2 transition-all duration-200
                ${selected ? "border-farm-green bg-farm-light/30 shadow-md" : "border-gray-100 hover:border-farm-green/50 hover:bg-white"}
            `}
        >
            <div className="flex flex-col sm:flex-row gap-4 p-4">
               {image && (
                <div className="shrink-0">
                    <img src={image} alt={title} className="h-24 w-24 rounded-lg object-cover bg-gray-100" />
                </div>
               )}
               <div className="flex-1">
                   <div className="flex items-center justify-between mb-1">
                       <h3 className="font-bold text-lg text-farm-dark">{title}</h3>
                       <div className={`
                            h-6 w-6 rounded-full border-2 flex items-center justify-center transition-colors
                            ${selected ? "border-farm-green bg-farm-green text-white" : "border-gray-300 group-hover:border-farm-green"}
                       `}>
                           {selected && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                       </div>
                   </div>
                   <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
               </div>
            </div>
        </div>
    )
}

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
            await setError("Te rugăm să alegi oferta și să introduci email-ul.");
            return;
        };
        // Backup offer to localStorage
        localStorage.setItem("greenmart_offer", offer);
        
        setLoading(true);
        try {
            const resp = await fetch(`${import.meta.env.VITE_SUPABASE_FUNCTIONS_URL}/auth-email-exists`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, table }),
            });
            if (resp.ok) {
                const check: { exists?: boolean, id?: string, completed_account?: boolean } = await resp.json();
                if (check.completed_account) { setError("Ai deja un cont pe aceasta adresa de email"); setLoading(false); return; }
                
                let id = check.id;
                
                if (check.exists && id) {
                    await fetch(`${import.meta.env.VITE_SUPABASE_FUNCTIONS_URL}/update-user`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ id, offer }),
                    });
                } else {
                     const add_user = await fetch(`${import.meta.env.VITE_SUPABASE_FUNCTIONS_URL}/add-user`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email, table, offer }),
                    });
                    const answ = await add_user.json();
                    id = answ.id;
                }

                 const res = await fetch(`${import.meta.env.VITE_SUPABASE_FUNCTIONS_URL}/session`, {
                        method: "PATCH",
                        credentials: "include",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ id: id, email: email, offer: offer }),
                    });

                if (!res.ok) throw new Error("Failed to update session");
                navigate('/plans', { state: { userId: id } });
            } else {
                setError("A apărut o eroare. Încearcă din nou.");
            }
        }
        catch (err) { 
            console.error(err);
            setError("Eroare de conexiune.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-white">
            <Offer />
            
            {/* Header Simplified */}
            <div className="border-b border-gray-100 py-4">
                <Container className="flex items-center justify-center">
                    <div className="flex items-center gap-2">
                        <div className="bg-farm-green/10 p-1.5 rounded-lg">
                             <Leaf className="h-6 w-6 text-farm-green" />
                        </div>
                        <span className="text-xl font-display font-extrabold text-farm-dark">Green<span className="text-farm-green">Mart</span></span>
                    </div>
                </Container>
            </div>

            <main className="py-12 md:py-20 bg-farm-cream/50">
                <Container size="md">
                    <div className="grid md:grid-cols-12 gap-12 items-start">
                        
                        {/* LEFT COLUMN: Copy */}
                        <div className="md:col-span-5 space-y-6">
                            <span className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold uppercase tracking-wide">
                                <Gift className="h-3.5 w-3.5" />
                                Cadou de Bun Venit
                            </span>
                            <h1 className="text-4xl md:text-5xl font-extrabold text-farm-dark leading-tight">
                                Alege cadoul tău <span className="text-farm-green">gratuit.</span>
                            </h1>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                Alătură-te comunității GreenMart astăzi. Primești produse locale proaspete livrate la ușă și un cadou special în prima cutie.
                            </p>
                            
                            <div className="space-y-4 pt-4">
                                {[
                                    "Produse artizanale autentice",
                                    "Livrare gratuită la fiecare comandă",
                                    "Susții micii fermieri locali",
                                    "Anulezi oricând, fără întrebări"
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center text-farm-green shrink-0">
                                            <Check className="h-3.5 w-3.5" strokeWidth={3} />
                                        </div>
                                        <span className="text-gray-700 font-medium">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Form */}
                        <div className="md:col-span-7">
                            <Card className="p-6 md:p-8 shadow-xl border-t-4 border-t-farm-green">
                                <h2 className="text-2xl font-bold text-farm-dark mb-6">Selectează oferta preferată</h2>
                                
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-4">
                                        <SelectableOption
                                            title="Miere Naturală"
                                            description="Borcan de miere pură de la apicultori locali. Valoare 42 Lei."
                                            image="https://hasxcndrhvtyjphntpft.supabase.co/storage/v1/object/public/images/mieredealbine.jpg"
                                            selected={offer === "Miere"}
                                            onSelect={() => setOffer("Miere")}
                                        />
                                        <SelectableOption
                                            title="Sirop de Fructe"
                                            description="Preparat din fructe locale, fără aditivi. Valoare 35 Lei."
                                            image="https://hasxcndrhvtyjphntpft.supabase.co/storage/v1/object/public/images/syrup.jpg"
                                            selected={offer === "Sirop"}
                                            onSelect={() => setOffer("Sirop")}
                                        />
                                        <SelectableOption
                                            title="Fursecuri Artizanale"
                                            description="200g de fursecuri de casă pe viață la fiecare comandă. Valoare 300 Lei."
                                            image="https://hasxcndrhvtyjphntpft.supabase.co/storage/v1/object/public/images/ChatGPT%20Image%20Nov%2017,%202025,%2002_09_51%20PM(1).png"
                                            selected={offer === "Fursecuri"}
                                            onSelect={() => setOffer("Fursecuri")}
                                        />
                                    </div>

                                    <div className="pt-4 space-y-4">
                                        <div>
                                            <input
                                                type="email"
                                                required
                                                placeholder="Adresa ta de email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-farm-green focus:ring-2 focus:ring-farm-green/20 outline-none transition-all text-lg"
                                            />
                                        </div>
                                        
                                        <Button 
                                            type="submit" 
                                            loading={loading}
                                            disabled={loading}
                                            size="lg"
                                            className="w-full text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                                        >
                                            Revendică Oferta & Continuă
                                        </Button>
                                        
                                        {error && (
                                            <p className="text-red-600 text-sm text-center bg-red-50 p-2 rounded-lg font-medium">
                                                {error}
                                            </p>
                                        )}
                                        
                                        <p className="text-xs text-center text-gray-500 leading-relaxed px-4">
                                            Prin continuarea înscrierii, confirmi că ai citit și ești de acord cu <a href="/termeni" className="underline hover:text-farm-green">Termenii și Condițiile</a>.
                                        </p>
                                    </div>
                                </form>
                            </Card>
                        </div>

                    </div>
                </Container>
            </main>
            <Footer />
        </div>
    );
}

// Keep the old Option component around if needed for backward compatibility or remove it if unused.
// Since we used inline SelectableOption, the old component is techincally not used here anymore.

