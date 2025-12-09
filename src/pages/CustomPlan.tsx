import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";
import { ProductCard, Product } from "../components/ProductItem";
import { Offer } from "../components/Offer";
import { Leaf } from "lucide-react";

const slugify = (value: string) =>
    value.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "other";

export const CustomPlan: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [cart, setCart] = useState<Record<string, number>>({});
    const [search, setSearch] = useState("");

    // ----------------- LOAD PRODUCTS -----------------
    useEffect(() => {
        const loadProducts = async () => {
            setLoading(true);
            setError(null);

            const { data, error } = await supabase
                .from("products")
                .select("*")
                .eq("is_active", true)
                .order("tag", { ascending: true })
                .order("name", { ascending: true });

            if (error) {
                console.error(error);
                setError("Failed to load products.");
            } else {
                setProducts((data || []) as Product[]);
            }

            setLoading(false);
        };

        loadProducts();
    }, []);

    // ----------------- GROUP BY TAG + SEARCH -----------------
    const groupedByTag = useMemo(() => {
        const result: Record<string, Product[]> = {};
        const q = search.toLowerCase().trim();

        for (const p of products) {
            if (q) {
                const haystack = `${p.name} ${p.tag ?? ""}`.toLowerCase();
                if (!haystack.includes(q)) continue;
            }

            const key = p.tag?.trim() || "Other";
            if (!result[key]) result[key] = [];
            result[key].push(p);
        }

        return result;
    }, [products, search]);

    const tagKeys = useMemo(
        () => Object.keys(groupedByTag).sort((a, b) => a.localeCompare(b)),
        [groupedByTag]
    );

    // ----------------- CART LOGIC -----------------
    const getQuantity = (productId: string) => cart[productId] ?? 0;

    const incrementQuantity = (productId: string) => {
        setCart((prev) => ({
            ...prev,
            [productId]: (prev[productId] ?? 0) + 1,
        }));
    };

    const decrementQuantity = (productId: string) => {
        setCart((prev) => {
            const current = prev[productId] ?? 0;
            if (current <= 1) {
                // remove product from cart
                const { [productId]: _, ...rest } = prev;
                return rest;
            }
            return {
                ...prev,
                [productId]: current - 1,
            };
        });
    };

    const totalItems = useMemo(
        () => Object.values(cart).reduce((sum, qty) => sum + qty, 0),
        [cart]
    );

    const totalPrice = useMemo(() => {
        return products.reduce((sum, p) => {
            const qty = cart[p.id] ?? 0;
            return sum + qty * p.price_ron;
        }, 0);
    }, [cart, products]);

    const handleScrollToTag = (tag: string) => {
        const id = slugify(tag || "Other");
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    const handleConfirmSelection = () => {
        const entries = Object.entries(cart); // [ [productId, qty], ... ]
        console.log("Cart:", entries);

        // aici vei trimite la checkout / API
        alert(
            `You selected ${totalItems} items for your box.\n` +
            entries.map(([id, qty]) => `${id}: ${qty}x`).join("\n")
        );
    };

    // ----------------- RENDER -----------------
    return (
        <div className="min-h-screen bg-slate-50">
            <div className="flex flex-col mb-12">
                <Offer></Offer>
                <div className="flex flex-wrap items-center gap-2 mt-6 justify-center w-full">
                    <div className="flex items-center min-w-0">
                        <Leaf className="h-8 w-8 mr-1 min-w-0" aria-hidden="true" />
                        <span className="text-3xl font-bold text-farm-dark min-w-0 ">Green</span>
                        <span className="text-3xl font-bold text-farm-green min-w-0 ">Mart</span>
                    </div>
                </div>
                <div className="mt-6 flex flex-col items-center px-6 gap-4">
                    <h2 className="text-center font-bold text-3xl">Selecteaza preferinta ta</h2>
                    <h3 className="text-center font-bold text-gray-700 md:max-w-[50%] sm:max-w-[75%]">Alege dintre produse artizanale (ex.: gemuri, zacusca, conserve) fructe si legume</h3>
                </div>
            </div>
            <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 lg:flex-row">
                {/* LEFT SIDEBAR: TAG LIST */}
                <aside className="w-full shrink-0 border-b border-slate-200 bg-white px-3 py-4 shadow-sm lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)] lg:w-64 lg:border lg:rounded-2xl">
                    <ul className="mt-2 space-y-1 text-sm">
                        {tagKeys.map((tag) => {
                            const items = groupedByTag[tag] || [];
                            const tagLabel = tag === "Other" ? "Other" : tag;

                            return (
                                <li key={tag}>
                                    <button
                                        type="button"
                                        onClick={() => handleScrollToTag(tag)}
                                        className="flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left text-xs text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
                                    >
                                        <span className="truncate">{tagLabel}</span>
                                        <span className="ml-2 inline-flex h-5 min-w-[1.5rem] items-center justify-center rounded-full bg-slate-100 text-[10px] text-slate-600">
                                            {items.length}
                                        </span>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>

                    <div className="mt-6 border-t border-slate-100 pt-4 space-y-1">
                        <p className="text-xs text-slate-500">
                            Selected items:{" "}
                            <span className="font-semibold text-emerald-700">
                                {totalItems}
                            </span>
                        </p>
                        <p className="text-xs text-slate-500">
                            Estimated total:{" "}
                            <span className="font-semibold text-emerald-700">
                                {totalPrice.toFixed(2)} RON
                            </span>
                        </p>
                    </div>
                </aside>

                {/* RIGHT: PRODUCTS LIST */}
                <main className="flex-1">
                    {error && (
                        <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">
                            {error}
                        </div>
                    )}

                    <div className="space-y-8">
                        {tagKeys.map((tag) => {
                            const items = groupedByTag[tag] || [];
                            if (items.length === 0) return null;

                            const tagLabel = tag === "Other" ? "Other products" : tag;

                            return (
                                <section
                                    key={tag}
                                    id={slugify(tag)}
                                    className="scroll-mt-20"
                                >
                                    <h2 className="mb-3 text-sm font-semibold text-slate-900">
                                        {tagLabel}
                                    </h2>

                                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                        {items.map((product) => (
                                            <ProductCard
                                                key={product.id}
                                                product={product}
                                                quantity={getQuantity(product.id)}
                                                onIncrement={() => incrementQuantity(product.id)}
                                                onDecrement={() => decrementQuantity(product.id)}
                                            />
                                        ))}
                                    </div>
                                </section>
                            );
                        })}

                        {!loading && tagKeys.length === 0 && !error && (
                            <p className="text-sm text-slate-500">
                                No products available at the moment.
                            </p>
                        )}
                    </div>
                </main>
            </div>

            {/* BOTTOM CART SUMMARY BAR */}
            {totalItems > 0 && (
                <div className="fixed bottom-4 left-1/2 z-30 -translate-x-1/2 px-4">
                    <div className="flex items-center gap-3 rounded-2xl bg-slate-900 px-4 py-3 text-xs text-slate-50 shadow-xl">
                        <span>
                            You selected{" "}
                            <span className="font-semibold">
                                {totalItems} item{totalItems === 1 ? "" : "s"}
                            </span>
                            {totalPrice > 0 && (
                                <>
                                    {" "}
                                    ·{" "}
                                    <span className="font-semibold">
                                        {totalPrice.toFixed(2)} RON
                                    </span>
                                </>
                            )}
                        </span>
                        <button
                            type="button"
                            onClick={handleConfirmSelection}
                            className="ml-auto rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-400"
                        >
                            Continue
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
