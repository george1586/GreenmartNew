// src/pages/Subscriptions.tsx
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

// 🔗 Edge Functions URL (configurează prin .env dacă vrei)
const FUNCTIONS_BASE =
    (import.meta.env.VITE_SUPABASE_FUNCTIONS_URL as string) ||
    "https://hasxcndrhvtyjphntpft.functions.supabase.co";

type StripePrice = {
    id: string;
    nickname: string | null;
    currency: string;
    unit_amount: number | null;
    product?: string | null;
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
    current_period_end: number; // unix seconds
    items: StripeItem[];
    created: number;
    latest_invoice?: string | null;
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

    async function onCancel(id: string) {
        if (!confirm("Sigur vrei să anulezi la sfârșitul perioadei curente?")) return;
        try {
            setWorkingId(id);
            const { data: sessionData } = await supabase.auth.getSession();
            const token = sessionData.session?.access_token;
            if (!token) throw new Error("Not authenticated");

            const res = await fetch(`${FUNCTIONS_BASE}/cancel-subscription`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ subscription_id: id, immediate: false }),
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
        <>
            <Header></Header>
            <main className="max-w-6xl mx-auto px-6 py-12 text-gray-800">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Abonamentele mele</h1>
                        <p className="text-gray-600 mt-1">
                            Vezi starea abonamentelor și gestionează anularea la sfârșitul perioadei.
                        </p>
                    </div>
                    <button
                        onClick={fetchSubs}
                        className="inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium hover:bg-gray-50"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Reîncarcă
                    </button>
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
                            <div key={i} className="border rounded-2xl p-5">
                                <div className="h-5 w-40 bg-gray-100 rounded animate-pulse mb-4" />
                                <div className="space-y-2">
                                    <div className="h-4 w-56 bg-gray-100 rounded animate-pulse" />
                                    <div className="h-4 w-44 bg-gray-100 rounded animate-pulse" />
                                    <div className="h-4 w-64 bg-gray-100 rounded animate-pulse" />
                                </div>
                                <div className="mt-5 h-9 w-64 bg-gray-100 rounded-xl animate-pulse" />
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
                                        onCancel={() => onCancel(s.id)}
                                        working={workingId === s.id}
                                    />
                                ))}
                            </div>
                        ) : (
                            <EmptyState />
                        )}
                    </>
                )}
            </main>
        </>
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

    const nickname = price?.nickname ?? "Plan";
    const created = new Date(sub.created * 1000).toLocaleString("ro-RO");
    const renews = new Date(sub.current_period_end * 1000).toLocaleString("ro-RO");

    const statusUi = getStatusUi(sub.status, sub.cancel_at_period_end);

    return (
        <div className="rounded-2xl border p-5 shadow-sm hover:shadow transition-shadow bg-white">
            {/* Title row */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h2 className="text-lg font-semibold">{nickname}</h2>
                    <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-gray-600">
                        <span className="inline-flex items-center gap-1">
                            <CreditCard className="h-4 w-4" /> {amount}
                            {item?.quantity ? <span className="text-gray-400"> · {item.quantity} buc</span> : null}
                        </span>
                        <span className="inline-flex items-center gap-1">
                            <CalendarDays className="h-4 w-4" /> Creat: {created}
                        </span>
                        <span className="inline-flex items-center gap-1">
                            <Clock className="h-4 w-4" /> Valabil până la: {renews}
                        </span>
                    </div>
                </div>

                {/* Status badge */}
                <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${statusUi.badge}`}
                    title={statusUi.title}
                >
                    {statusUi.icon}
                    {statusUi.label}
                </span>
            </div>

            {/* Info note if scheduled to cancel */}
            {sub.cancel_at_period_end && (
                <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-amber-800 text-sm flex items-center gap-2">
                    <PauseCircle className="h-4 w-4" />
                    Abonamentul este programat pentru anulare la sfârșitul perioadei curente.
                </div>
            )}

            {/* Actions */}
            <div className="mt-5 flex flex-wrap gap-3">
                <button
                    disabled={working || sub.status !== "active" || sub.cancel_at_period_end}
                    onClick={onCancel}
                    className="inline-flex items-center gap-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-sm px-4 py-2 disabled:opacity-60"
                    title="Programează anularea la finalul perioadei curente"
                >
                    {working ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
                    {working ? "Se procesează…" : "Anulează la sfârșitul perioadei"}
                </button>

                {/* (optional) aici poți adăuga un buton către portalul de billing dacă ai endpoint pentru el */}
                {/* <a href="/billing-portal" className="inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm hover:bg-gray-50">
          <ExternalLink className="h-4 w-4" /> Gestionare facturi
        </a> */}
            </div>

            {/* Footer tiny details */}
            <div className="mt-4 text-xs text-gray-500">
                ID abonament: {sub.id} {sub.latest_invoice ? `· Factură: ${sub.latest_invoice}` : ""}
            </div>
        </div>
    );
}

function EmptyState() {
    return (
        <div className="rounded-2xl border p-10 text-center bg-white">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-50">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold">Nu ai abonamente active în acest moment</h3>
            <p className="mt-1 text-sm text-gray-600">
                Când cumperi un abonament, îl vei vedea aici și îl poți gestiona oricând.
            </p>
            <div className="mt-6">
                <a
                    href="/"
                    className="inline-flex items-center rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm px-5 py-2.5"
                >
                    Vezi planurile
                </a>
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
