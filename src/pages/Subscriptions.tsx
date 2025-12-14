import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";
import {
    CalendarDays,
    Clock,
    CreditCard,
    PauseCircle,
    XCircle,
    Loader2,
    AlertTriangle,
    RefreshCw,
    CheckCircle2,
} from "lucide-react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Container } from "../components/ui/Container";
import { Button } from "../components/ui/Button";
import { Helmet } from "react-helmet-async";

// Edge Functions URL
const FUNCTIONS_BASE =
    (import.meta.env.VITE_SUPABASE_FUNCTIONS_URL as string) ||
    "https://hasxcndrhvtyjphntpft.functions.supabase.co";

type StripePrice = {
    id: string;
    nickname: string | null;
    currency: string;
    unit_amount: number | null;
    product?: string | null;
    product_name?: string | null;
};
type StripeItem = { id: string; price: StripePrice; quantity: number | null };
type StripeSub = {
    id: string;
    status:
    | "incomplete"
    | "incomplete_expired"
    | "trialing"
    | "active"
    | "past_due"
    | "canceled"
    | "unpaid"
    | "paused";
    cancel_at_period_end: boolean;
    current_period_end: number; 
    items: StripeItem[];
    created: number;
    latest_invoice?: string | null;
    is_test?: boolean;
    custom_items?: { name: string; quantity: number }[];
    metadata?: Record<string, string>;
};

export default function Subscriptions() {
    const [subs, setSubs] = useState<StripeSub[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [workingId, setWorkingId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    async function fetchSubs() {
        setLoading(true);
        setError(null);
        try {
            const { data: sessionData } = await supabase.auth.getSession();
            const token = sessionData.session?.access_token;
            if (!token) {
                setSubs([]);
                setLoading(false);
                return;
            }
            const res = await fetch(`${FUNCTIONS_BASE}/subscriptions`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error(await res.text());
            const json = await res.json();
            setSubs(Array.isArray(json.subscriptions) ? json.subscriptions : []);
        } catch (e) {
            console.error(e);
            setError("Nu am putut încărca abonamentele. Te rugăm încearcă din nou.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchSubs();
    }, []);

    async function onCancel(id: string, is_test?: boolean) {
        if (!confirm("Sigur vrei să anulezi la sfârșitul perioadei curente?")) return;
        try {
            setWorkingId(id);
            const { data: sessionData } = await supabase.auth.getSession();
            const token = sessionData.session?.access_token;
            if (!token) throw new Error("Not authenticated");

            const res = await fetch(`${FUNCTIONS_BASE}/cancel-subscription`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ subscription_id: id, immediate: false, is_test }),
            });
            if (!res.ok) throw new Error(await res.text());
            await fetchSubs();
        } catch (e) {
            console.error(e);
            alert("Nu am putut anula abonamentul. Încearcă din nou.");
        } finally {
            setWorkingId(null);
        }
    }

    const hasSubs = (subs?.length ?? 0) > 0;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Helmet>
                <title>Abonamente Greenmart – cutii cu legume locale</title>
                <link rel="canonical" href="https://greenmart.ro/subscriptii" />
            </Helmet>

            <Header />
            <main className="flex-grow py-12">
                <Container>
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-farm-dark">Abonamentele mele</h1>
                            <p className="text-gray-600 mt-1">
                                Vezi starea abonamentelor și gestionează livrările.
                            </p>
                        </div>
                        <Button
                            onClick={fetchSubs}
                            variant="ghost"
                            className="gap-2 bg-white shadow-sm border border-gray-200"
                        >
                            <RefreshCw className="h-4 w-4" />
                            Reîncarcă
                        </Button>
                    </div>

                    {/* Error banner */}
                    {error && (
                        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4" />
                            {error}
                        </div>
                    )}

                    {/* Loading skeleton */}
                    {loading && (
                        <div className="grid md:grid-cols-2 gap-6">
                            {Array.from({ length: 2 }).map((_, i) => (
                                <div key={i} className="border rounded-2xl p-6 bg-white shadow-sm">
                                    <div className="h-6 w-40 bg-gray-100 rounded animate-pulse mb-4" />
                                    <div className="space-y-3">
                                        <div className="h-4 w-56 bg-gray-100 rounded animate-pulse" />
                                        <div className="h-4 w-44 bg-gray-100 rounded animate-pulse" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Content */}
                    {!loading && !error && (
                        <>
                            {hasSubs ? (
                                <div className="grid md:grid-cols-2 gap-6">
                                    {subs!.map((s) => (
                                        <SubscriptionCard
                                            key={s.id}
                                            sub={s}
                                            onCancel={() => onCancel(s.id, s.is_test)}
                                            working={workingId === s.id}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <EmptyState />
                            )}
                        </>
                    )}
                </Container>
            </main>
            <Footer />
        </div>
    );
}

/* ---------- Components ---------- */

function SubscriptionCard({
    sub,
    onCancel,
    working,
}: {
    sub: StripeSub;
    onCancel: () => void;
    working: boolean;
}) {
    const item = sub.items[0];
    const price = item?.price;

    const amount = useMemo(() => {
        if (!price?.unit_amount || !price.currency) return "-";
        return new Intl.NumberFormat("ro-RO", { style: "currency", currency: price.currency }).format(
            price.unit_amount / 100
        );
    }, [price]);

    const nickname = price?.nickname || price?.product_name || "Plan";
    const created = new Date(sub.created * 1000).toLocaleString("ro-RO");
    
    // const renews = new Date(sub.current_period_end * 1000).toLocaleString("ro-RO"); 
    // ^ unused in original but useful, keeping commented or re-enabling if needed.

    const statusUi = getStatusUi(sub.status, sub.cancel_at_period_end);

    return (
        <div className="rounded-2xl border p-6 shadow-sm hover:shadow-md transition-shadow bg-white flex flex-col">
            {/* Title row */}
            <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                    <h2 className="text-lg font-bold text-farm-dark">{nickname}</h2>
                    <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-gray-600">
                        {sub.is_test && (
                            <span className="inline-flex items-center gap-1 rounded bg-yellow-100 px-2 py-0.5 text-xs font-bold text-yellow-800 uppercase border border-yellow-200">
                                Test
                            </span>
                        )}
                        <span className="inline-flex items-center gap-1 font-medium text-farm-green">
                            <CreditCard className="h-4 w-4" /> {amount}
                        </span>
                        {item?.quantity && (
                             <span className="text-gray-400"> · {item.quantity} buc</span>
                        )}
                    </div>
                     <div className="mt-1 text-xs text-gray-500 flex items-center gap-1">
                        <CalendarDays className="h-3 w-3" /> Creat: {created}
                    </div>
                </div>

                {/* Status badge */}
                <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${statusUi.badge}`}
                    title={statusUi.title}
                >
                    {statusUi.icon}
                    {statusUi.label}
                </span>
            </div>

            {/* Custom Items List */}
            {sub.custom_items && sub.custom_items.length > 0 && (
                <div className="mb-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
                   <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Conținut Pachet:</h4>
                   <ul className="text-sm space-y-1 text-gray-700">
                       {sub.custom_items.map((ci, idx) => (
                           <li key={idx} className="flex justify-between">
                               <span>{ci.name}</span>
                               <span className="font-mono font-medium text-gray-500">x{ci.quantity}</span>
                           </li>
                       ))}
                   </ul>
                </div>
            )}

            {/* Free Gift Display */}
            {sub.metadata?.offer && sub.metadata.offer !== "None" && (
                 <div className="mb-4 px-3 py-2 bg-yellow-50 rounded-xl border border-yellow-100 flex items-center gap-2">
                    <span className="text-xl">🎁</span>
                    <div>
                        <h4 className="text-[10px] font-bold text-yellow-800 uppercase tracking-wide">Cadou Selectat:</h4>
                        <p className="text-sm font-medium text-yellow-900">{sub.metadata.offer}</p>
                    </div>
                 </div>
            )}

            {/* Info note if scheduled to cancel */}
            {sub.cancel_at_period_end && (
                <div className="mt-auto mb-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-amber-800 text-sm flex items-center gap-2">
                    <PauseCircle className="h-4 w-4" />
                    Abonamentul se va încheia la sfârșitul perioadei curente.
                </div>
            )}

            {/* Actions */}
            <div className={`mt-auto pt-4 border-t border-gray-100 flex flex-wrap gap-3 ${sub.cancel_at_period_end ? 'pt-0 border-none' : ''}`}>
                 {!sub.cancel_at_period_end && (
                    <button
                        disabled={working || sub.status !== "active" || sub.cancel_at_period_end}
                        onClick={onCancel}
                        className="inline-flex items-center gap-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 text-sm px-4 py-2 disabled:opacity-60 transition-colors font-medium ml-auto"
                        title="Programează anularea la finalul perioadei curente"
                    >
                        {working ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
                        {working ? "Se procesează…" : "Anulează Abonamentul"}
                    </button>
                 )}
            </div>

            {/* Footer tiny details */}
            <div className="mt-4 text-[10px] text-gray-400 font-mono">
                ID: {sub.id}
            </div>
        </div>
    );
}

function EmptyState() {
    return (
        <div className="rounded-2xl border-2 border-dashed border-gray-200 p-10 text-center bg-gray-50/50 col-span-full">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm border border-gray-100">
                <CheckCircle2 className="h-8 w-8 text-farm-green/50" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Nu ai abonamente active</h3>
            <p className="mt-2 text-sm text-gray-500 max-w-sm mx-auto">
                Nu ai niciun abonament activ în acest moment. Alege un plan pentru a începe livrările.
            </p>
            <div className="mt-6">
                <Button onClick={() => window.location.href = "/plans"}>
                    Vezi Planurile
                </Button>
            </div>
        </div>
    );
}

/* ---------- helpers ---------- */

function getStatusUi(
    status: StripeSub["status"],
    cancelAtPeriodEnd: boolean
): { label: string; badge: string; icon: JSX.Element; title?: string } {
    if (cancelAtPeriodEnd && (status === "active" || status === "trialing")) {
        return {
            label: "Se închide",
            badge: "bg-amber-100 text-amber-800 ring-1 ring-inset ring-amber-200",
            icon: <PauseCircle className="h-3.5 w-3.5" />,
            title: "Programat pentru anulare la finalul perioadei",
        };
    }

    switch (status) {
        case "active":
            return {
                label: "Activ",
                badge: "bg-green-100 text-green-800 ring-1 ring-inset ring-green-200",
                icon: <CheckCircle2 className="h-3.5 w-3.5" />,
            };
        case "trialing":
            return {
                label: "Trial",
                badge: "bg-blue-100 text-blue-800 ring-1 ring-inset ring-blue-200",
                icon: <Clock className="h-3.5 w-3.5" />,
            };
        case "past_due":
        case "unpaid":
            return {
                label: "Neplătit",
                badge: "bg-rose-100 text-rose-800 ring-1 ring-inset ring-rose-200",
                icon: <AlertTriangle className="h-3.5 w-3.5" />,
            };
        case "paused":
            return {
                label: "Pauză",
                badge: "bg-amber-100 text-amber-800 ring-1 ring-inset ring-amber-200",
                icon: <PauseCircle className="h-3.5 w-3.5" />,
            };
        case "canceled":
            return {
                label: "Anulat",
                badge: "bg-gray-100 text-gray-700 ring-1 ring-inset ring-gray-200",
                icon: <XCircle className="h-3.5 w-3.5" />,
            };
        default:
            return {
                label: status,
                badge: "bg-gray-100 text-gray-700 ring-1 ring-inset ring-gray-200",
                icon: <Clock className="h-3.5 w-3.5" />,
            };
    }
}
