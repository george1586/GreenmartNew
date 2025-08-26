import "jsr:@supabase/functions-js/edge-runtime.d.ts";

type StripeList<T> = { data: T[] };
type StripeCustomer = { id: string; email?: string | null };
type StripePrice = { id: string; nickname: string | null; currency: string; unit_amount: number | null; product?: string | null };
type StripeItem = { id: string; price: StripePrice; quantity: number | null };
type StripeSubscription = {
    id: string; status: string; cancel_at_period_end: boolean; current_period_end: number;
    items: { data: StripeItem[] }; created: number; latest_invoice?: string | null; customer: string;
};

const STRIPE_KEY = Deno.env.get("STRIPE_SECRET_KEY")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

// ✅ CORS
const ALLOWED_ORIGINS = (Deno.env.get("ALLOWED_ORIGINS") ?? "").split(",").map(s => s.trim()).filter(Boolean);
// e.g. ALLOWED_ORIGINS=https://greenmart.ro,http://localhost:5173
function corsHeaders(req: Request) {
    const origin = req.headers.get("origin") ?? "";
    const allow = ALLOWED_ORIGINS.length ? (ALLOWED_ORIGINS.includes(origin) ? origin : "") : "*";
    return {
        "Access-Control-Allow-Origin": allow || "null",
        "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
        "Access-Control-Allow-Headers": "authorization,content-type",
        "Access-Control-Max-Age": "86400",
    };
}
function withCors(req: Request, init: ResponseInit = {}, body?: BodyInit | null) {
    return new Response(body, { ...init, headers: { ...(init.headers || {}), ...corsHeaders(req) } });
}

function qs(p: Record<string, string>) { return new URLSearchParams(p).toString(); }
async function stripe(path: string, init?: RequestInit) {
    const headers = { Authorization: `Bearer ${STRIPE_KEY}`, "Content-Type": "application/x-www-form-urlencoded" };
    return fetch(`https://api.stripe.com/v1${path}`, { ...init, headers: { ...headers, ...(init?.headers || {}) } });
}
async function getUserFromToken(bearer: string) {
    const r = await fetch(`${SUPABASE_URL}/auth/v1/user`, { headers: { Authorization: bearer, apikey: SUPABASE_ANON_KEY } });
    if (!r.ok) return null;
    return r.json();
}

Deno.serve(async (req) => {
    // CORS preflight
    if (req.method === "OPTIONS") return withCors(req, { status: 204 });

    if (req.method !== "GET")
        return withCors(req, { status: 405 }, "Method not allowed");

    const auth = req.headers.get("authorization");
    if (!auth?.startsWith("Bearer "))
        return withCors(req, { status: 401 }, "Missing authorization header");

    const user = await getUserFromToken(auth);
    if (!user?.email) return withCors(req, { status: 401 }, "Unauthorized");

    // 1) customer_id din metadata dacă există
    let customerId: string | null =
        user.user_metadata?.stripe_customer_id ??
        user.app_metadata?.stripe_customer_id ??
        null;

    // 2) fallback: căutare după email (atenție: test/live key)
    if (!customerId) {
        const search = await stripe(`/customers/search?${qs({ query: `email:'${user.email}'` })}`, { method: "GET" });
        if (!search.ok) {
            const t = await search.text(); console.error("Stripe search error:", t);
            return withCors(req, { status: 502 }, "Stripe error");
        }
        const json = (await search.json()) as StripeList<StripeCustomer>;
        customerId = json.data?.[0]?.id ?? null;
    }

    // 3) fără customer -> listă goală
    if (!customerId) {
        return withCors(req, { status: 200, headers: { "Content-Type": "application/json" } }, JSON.stringify({ subscriptions: [] }));
    }

    // 4) listează subs
    const subsRes = await stripe(`/subscriptions?customer=${customerId}&limit=20&expand[]=data.items.data.price`);
    if (!subsRes.ok) {
        const t = await subsRes.text(); console.error("Stripe subs error:", t);
        return withCors(req, { status: 502 }, "Stripe error");
    }

    const list = await subsRes.json() as StripeList<StripeSubscription>;
    const normalized = list.data.map((s) => ({
        id: s.id,
        status: s.status,
        cancel_at_period_end: s.cancel_at_period_end,
        current_period_end: s.current_period_end,
        created: s.created,
        latest_invoice: s.latest_invoice ?? null,
        items: s.items.data.map((it) => ({
            id: it.id,
            quantity: it.quantity,
            price: {
                id: it.price.id, nickname: it.price.nickname, currency: it.price.currency,
                unit_amount: it.price.unit_amount, product: it.price.product ?? null,
            },
        })),
    }));

    return withCors(req, { headers: { "Content-Type": "application/json" } }, JSON.stringify({ subscriptions: normalized }));
});
