import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const STRIPE_KEY = Deno.env.get("STRIPE_SECRET_KEY")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

const ALLOWED_ORIGINS = (Deno.env.get("ALLOWED_ORIGINS") ?? "").split(",").map(s => s.trim()).filter(Boolean);
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

    if (req.method !== "POST")
        return withCors(req, { status: 405 }, "Method not allowed");

    const auth = req.headers.get("authorization");
    if (!auth?.startsWith("Bearer "))
        return withCors(req, { status: 401 }, "Missing authorization header");

    let payload: { subscription_id?: string; immediate?: boolean } = {};
    try { payload = await req.json(); } catch { return withCors(req, { status: 400 }, "Invalid JSON"); }

    const { subscription_id, immediate } = payload;
    if (!subscription_id) return withCors(req, { status: 400 }, "Missing subscription_id");

    const user = await getUserFromToken(auth);
    if (!user?.email) return withCors(req, { status: 401 }, "Unauthorized");

    // customer_id din metadata sau căutare după email
    let customerId: string | null =
        user.user_metadata?.stripe_customer_id ??
        user.app_metadata?.stripe_customer_id ??
        null;

    if (!customerId) {
        const search = await stripe(`/customers/search?${qs({ query: `email:'${user.email}'` })}`, { method: "GET" });
        if (search.ok) {
            const j = await search.json();
            customerId = j.data?.[0]?.id ?? null;
        }
    }
    if (!customerId) return withCors(req, { status: 400 }, "No Stripe customer for this user");

    // verifică subs-ul
    const getSub = await stripe(`/subscriptions/${subscription_id}`, { method: "GET" });
    if (!getSub.ok) {
        const t = await getSub.text(); console.error("Stripe get sub err:", t);
        return withCors(req, { status: 404 }, "Subscription not found");
    }
    const sub = await getSub.json();
    if (sub.customer !== customerId) return withCors(req, { status: 403 }, "Forbidden");

    // anulare
    if (immediate) {
        const del = await stripe(`/subscriptions/${subscription_id}`, { method: "DELETE" });
        if (!del.ok) {
            const t = await del.text(); console.error("Stripe cancel now err:", t);
            return withCors(req, { status: 502 }, "Failed to cancel");
        }
        return withCors(req, { headers: { "Content-Type": "application/json" } }, JSON.stringify({ ok: true, mode: "immediate" }));
    } else {
        const update = await stripe(`/subscriptions/${subscription_id}`, {
            method: "POST",
            body: new URLSearchParams({ cancel_at_period_end: "true" }),
        });
        if (!update.ok) {
            const t = await update.text(); console.error("Stripe cancel at period end err:", t);
            return withCors(req, { status: 502 }, "Failed to schedule cancellation");
        }
        return withCors(req, { headers: { "Content-Type": "application/json" } }, JSON.stringify({ ok: true, mode: "period_end" }));
    }
});
