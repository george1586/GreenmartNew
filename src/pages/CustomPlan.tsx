import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Footer } from "../components/Footer";
const FUNCTIONS_BASE = (import.meta.env.VITE_SUPABASE_FUNCTIONS_URL as string) || "https://hasxcndrhvtyjphntpft.functions.supabase.co";
import { Header } from "../components/Header";
import { Container } from "../components/ui/Container";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { getSession } from "../hooks/getSession";
import { supabase } from "../lib/supabase";
import { Loader2, Plus, Minus, ShoppingBag, X, CheckCircle2 } from "lucide-react";
import { getPriceId } from "../lib/prices";

interface Product {
    id: number;
    name: string;
    description?: string;
    image_url: string;
    category: string;
    price: number; 
    tag: string;
}

export function CustomPlan() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);
    const [groupedProducts, setGroupedProducts] = useState<Record<string, Product[]>>({});
    const [cart, setCart] = useState<Record<number, number>>({});
    const [boxSize, setBoxSize] = useState<"Medie" | "Mare" | "">("");
    const [boxLimit, setBoxLimit] = useState(0);
    const [error, setError] = useState("");
    const [activeTag, setActiveTag] = useState("all");

    // Fetch products and session
    useEffect(() => {
        async function fetchData() {
            try {
                // 1. Get Session for Box Size
                const session = await getSession();
                if (!session?.email) {
                    navigate("/get-started");
                    return;
                }
                const size = (session.size as "Medie" | "Mare") || "Medie";
                setBoxSize(size);
                // Limits: Medium = 12 items, Large = 20 items (Example)
                setBoxLimit(size === "Mare" ? 20 : 12);

                // 2. Fetch Products
                const { data, error } = await supabase.from("items").select("*");
                if (error) throw error;
                
                if (data) {
                    setProducts(data);
                    // Group by tag
                    const groups: Record<string, Product[]> = {};
                    data.forEach((p) => {
                        const tag = p.tag || "Altele";
                        if (!groups[tag]) groups[tag] = [];
                        groups[tag].push(p);
                    });
                    setGroupedProducts(groups);
                    if (Object.keys(groups).length > 0) {
                         setActiveTag(Object.keys(groups)[0]);
                    }
                }
            } catch (err) {
                console.error(err);
                setError("Eroare la încărcarea datelor.");
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [navigate]);

    const addToCart = (id: number) => {
        const currentCount = Object.values(cart).reduce((a, b) => a + b, 0);
        if (currentCount >= boxLimit) return; // Limit reached
        
        setCart(prev => ({
            ...prev,
            [id]: (prev[id] || 0) + 1
        }));
    };

    const removeFromCart = (id: number) => {
        setCart(prev => {
            const count = prev[id] || 0;
            if (count <= 1) {
                const { [id]: _, ...rest } = prev;
                return rest;
            }
            return { ...prev, [id]: count - 1 };
        });
    };

    const cartTotalItems = Object.values(cart).reduce((a, b) => a + b, 0);
    const remainingItems = boxLimit - cartTotalItems;

    async function handleContinue() {
        setSubmitting(true);
        try {
            // 1. Update Session with cart
            const updateRes = await fetch(`${FUNCTIONS_BASE}/session`, {
                method: "PATCH",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    cart: cart 
                }),
            });

             const session = await getSession();
             
             // Custom Plan is always "Custom"
             const priceId = getPriceId("Custom", boxSize);
             
            if (!priceId) {
                 throw new Error("Missing Price ID for Custom Plan. Check .env");
             }

            // Generate Packing Summary (Human Readable)
            const summaryParts: string[] = [];
            Object.entries(cart).forEach(([id, qty]) => {
                 if (qty > 0) {
                     // Find product name
                     let name = "Unknown";
                     Object.values(groupedProducts).flat().forEach(p => {
                         if (p.id === Number(id)) name = p.name;
                     });
                     summaryParts.push(`${qty}x ${name}`);
                 }
            });
            const cartSummary = summaryParts.join(", ");
            
            const res = await fetch(`${FUNCTIONS_BASE}/create-checkout-session`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "x-stripe-mode": import.meta.env.VITE_APP_MODE || "live",
                    "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
                },
                body: JSON.stringify({
                    priceId, 
                    customerEmail: session.email,
                    cart,
                    offer: session.offer || localStorage.getItem("greenmart_offer"), // <--- Backup
                    cartSummary,          
                    success_url: `${window.location.origin}/thank-you`,
                    cancel_url: `${window.location.origin}/custom-plan`,
                }),
            });

            if (!res.ok) {
                 const errData = await res.json().catch(() => ({}));
                 throw new Error(errData.error || `Server error: ${res.status}`);
            }

            const data = await res.json();
            if (data.url) window.location.href = data.url;

        } catch (err: any) {
            console.error(err);
            setError(err.message || "Eroare la procesarea comenzii.");
            setSubmitting(false);
        }
    }

    if (loading) return <div className="min-h-screen grid place-items-center"><Loader2 className="animate-spin h-8 w-8 text-farm-green" /></div>;

    return (
        <div className="min-h-screen bg-gray-50 pb-24 md:pb-0">
            <Header />

            {/* Sticky "Box Status" Bar (Desktop & Mobile) */}
            <div className="bg-white border-b sticky top-[60px] z-30 shadow-sm transition-all">
                <Container className="py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-farm-dark">Alege Produsele</h1>
                        <p className="text-gray-500 text-sm">Cutie {boxSize} • Ai selectat {cartTotalItems} din {boxLimit} produse</p>
                    </div>
                    
                    <div className="flex-1 max-w-md mx-4 w-full">
                        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-farm-green transition-all duration-500 ease-out" 
                                style={{ width: `${(cartTotalItems / boxLimit) * 100}%` }}
                            />
                        </div>
                        <p className="text-xs text-right mt-1 text-gray-400">
                            {remainingItems > 0 ? `Mai ai loc pentru ${remainingItems} produse` : "Cutia este plină!"}
                        </p>
                    </div>

                    <div className="hidden md:block">
                        <Button
                            onClick={handleContinue}
                            disabled={submitting || cartTotalItems === 0}
                            size="lg"
                        >
                           {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                           {cartTotalItems === boxLimit ? "Finalizează Comanda" : "Continuă"}
                        </Button>
                    </div>
                </Container>
            </div>

            <main className="py-8">
                <Container>
                    {/* Category Tags */}
                    <div className="flex overflow-x-auto pb-4 gap-2 mb-6 sticky top-[120px] md:top-[120px] z-20 bg-gray-50/95 backdrop-blur py-2 no-scrollbar">
                        {Object.keys(groupedProducts).map(tag => (
                            <button
                                key={tag}
                                onClick={() => setActiveTag(tag)}
                                className={`
                                    px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors border
                                    ${activeTag === tag 
                                        ? "bg-farm-green text-white border-farm-green shadow-sm" 
                                        : "bg-white text-gray-600 border-gray-200 hover:border-farm-green/50 hover:text-farm-green"
                                    }
                                `}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>

                    {/* Active Products Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4 min-h-[50vh]">
                        {groupedProducts[activeTag]?.map(product => {
                            const quantity = cart[product.id] || 0;
                            return (
                                <Card key={product.id} className="overflow-hidden h-max flex flex-col h-auto hover:shadow-lg transition-all duration-300 border-gray-100 group">
                                    <div className="h-32 md:h-40 w-full bg-gray-100 relative overflow-hidden">
                                        <img 
                                            src={product.image_url || "https://placehold.co/400x400?text=No+Image"} 
                                            alt={product.name} 
                                            loading="lazy"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = "https://placehold.co/400x400?text=Greenmart";
                                            }}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                        {quantity > 0 && (
                                            <div className="absolute top-2 right-2 bg-farm-green text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm z-10">
                                                x{quantity}
                                            </div>
                                        )}
                                        {product.price > 0 && (
                                            <div className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm z-10">
                                                + {product.price}
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-3 flex flex-col">
                                        <h3 className="font-bold text-gray-900 mb-1 line-clamp-1 text-sm md:text-base leading-tight" title={product.name}>
                                            {product.name}
                                        </h3>
                                        <p className="text-xs text-gray-500 line-clamp-2 min-h-[2.5em] leading-tight overflow-hidden">
                                            {product.description || "Produs proaspăt."}
                                        </p>
                                        
                                        <div className="mt-3 text-center">
                                            {quantity === 0 ? (
                                                <Button 
                                                    size="sm" 
                                                    variant="secondary" 
                                                    className="w-full h-9 text-xs font-bold tracking-wide"
                                                    onClick={() => addToCart(product.id)}
                                                    disabled={cartTotalItems >= boxLimit}
                                                >
                                                    <Plus className="h-3.5 w-3.5 mr-1" /> Adaugă
                                                </Button>
                                            ) : (
                                                <div className="flex items-center justify-between w-full bg-gray-50 rounded-lg p-0.5 border border-gray-100">
                                                    <button 
                                                        onClick={() => removeFromCart(product.id)}
                                                        className="h-8 w-8 flex items-center justify-center hover:bg-white rounded-md transition-colors text-gray-600"
                                                    >
                                                        <Minus className="h-3.5 w-3.5" />
                                                    </button>
                                                    <span className="font-bold text-sm text-farm-dark px-2">{quantity}</span>
                                                    <button 
                                                        onClick={() => addToCart(product.id)}
                                                        className="h-8 w-8 flex items-center justify-center hover:bg-white rounded-md transition-colors text-farm-green disabled:opacity-50"
                                                        disabled={cartTotalItems >= boxLimit}
                                                    >
                                                        <Plus className="h-3.5 w-3.5" />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            )
                        })}
                    </div>
                </Container>
            </main>

            {/* Mobile Actions Bar */}
            <div className="fixed bottom-0 inset-x-0 bg-white border-t p-4 md:hidden z-40 bg-white/95 backdrop-blur">
                <div className="flex items-center gap-4">
                     <div className="flex-1">
                        <p className="text-xs font-medium text-gray-500 mb-1">Total: {cartTotalItems}/{boxLimit} produse</p>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-farm-green" style={{ width: `${(cartTotalItems / boxLimit) * 100}%` }} />
                        </div>
                     </div>
                     <Button
                        onClick={handleContinue}
                        disabled={submitting || cartTotalItems === 0}
                    >
                        {submitting ? <Loader2 className="animate-spin" /> : <ShoppingBag />}
                    </Button>
                </div>
            </div>

            <Footer />
        </div>
    )
}
