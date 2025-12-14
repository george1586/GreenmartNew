import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const LIVE_KEY = Deno.env.get("STRIPE_SECRET_KEY")!;
const TEST_KEY = Deno.env.get("STRIPE_SECRET_KEY_TEST")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

// CORS Helpers
const ALLOWED_ORIGINS = (Deno.env.get("ALLOWED_ORIGINS") ?? "").split(",").map(s => s.trim()).filter(Boolean);

function corsHeaders(req: Request) {
    const origin = req.headers.get("origin") ?? "";
    const allow = ALLOWED_ORIGINS.length ? (ALLOWED_ORIGINS.includes(origin) ? origin : "") : "*";
    return {
        "Access-Control-Allow-Origin": allow,
        "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
        "Access-Control-Allow-Headers": "authorization, assign, content-type, apikey, x-client-info",
        "Access-Control-Max-Age": "86400",
    };
}

function withCors(req: Request, init: ResponseInit = {}, body?: BodyInit | null) {
    return new Response(body, { ...init, headers: { ...(init.headers || {}), ...corsHeaders(req) } });
}

// Auth Helper
async function getUserFromToken(bearer: string) {
    const r = await fetch(`${SUPABASE_URL}/auth/v1/user`, { 
        headers: { Authorization: bearer, apikey: SUPABASE_ANON_KEY } 
    });
    if (!r.ok) return null;
    return r.json();
}

// Helper: Fetch Item Names from Supabase
async function fetchItemNames(ids: number[]) {
    if (ids.length === 0) return {};
    try {
        const query = `id=in.(${ids.join(",")})&select=id,name`;
        const res = await fetch(`${SUPABASE_URL}/rest/v1/items?${query}`, {
            headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` }
        });
        if (!res.ok) return {};
        const data: { id: number; name: string }[] = await res.json();
        const map: Record<number, string> = {};
        data.forEach(d => map[d.id] = d.name);
        return map;
    } catch {
        return {};
    }
}

// Stripe Helper
async function fetchStripeSubs(apiKey: string, email: string) {
    if (!apiKey) return [];
    
    const headers = { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/x-www-form-urlencoded" };
    
    try {
        // 1. Search customer
        const query = `email:'${email}'`;
        const searchRes = await fetch(`https://api.stripe.com/v1/customers/search?query=${encodeURIComponent(query)}`, { headers });
        if (!searchRes.ok) return [];
        
        const searchJson = await searchRes.json();
        const customers = searchJson.data || [];
        if (customers.length === 0) return [];

        // 2. Fetch subscriptions for ALL found customers (in parallel)
        const subPromises = customers.map(async (c: any) => {
            const res = await fetch(`https://api.stripe.com/v1/subscriptions?customer=${c.id}&limit=100&expand[]=data.items.data.price&status=all`, { headers });
            if (!res.ok) return [];
            const json = await res.json();
            return json.data || [];
        });

        const results = await Promise.all(subPromises);
        const subs: any[] = results.flat();

        // 3. Manually fetch products to get names
        const productIds = new Set<string>();
        subs.forEach(s => {
            s.items?.data?.forEach((i: any) => {
                if (i.price?.product) productIds.add(i.price.product as string);
            });
        });

        const productMap = new Map<string, string>();
        if (productIds.size > 0) {
            await Promise.all(Array.from(productIds).map(async (pid) => {
                const pRes = await fetch(`https://api.stripe.com/v1/products/${pid}`, { headers });
                if (pRes.ok) {
                    const pData = await pRes.json();
                    productMap.set(pid, pData.name);
                }
            }));
        }

        // 4. Attach product names
        subs.forEach(s => {
            s.items?.data?.forEach((i: any) => {
                if (i.price?.product) {
                    i.price.product_name = productMap.get(i.price.product as string) || null;
                }
            });
            s.__is_test_mode = apiKey.startsWith("sk_test");
        });
        
        return subs;
    } catch (err) {
        console.error("Error fetching stripe subs:", err);
        return [];
    }
}

Deno.serve(async (req) => {
    if (req.method === "OPTIONS") return withCors(req, { status: 204 });
    if (req.method !== "GET") return withCors(req, { status: 405 }, "Method not allowed");

    const auth = req.headers.get("authorization");
    if (!auth?.startsWith("Bearer ")) return withCors(req, { status: 401 }, "Missing authorization header");

    const user = await getUserFromToken(auth);
    if (!user?.email) return withCors(req, { status: 401 }, "Unauthorized");

    // Fetch from BOTH environments in parallel
    const [liveSubs, testSubs] = await Promise.all([
        fetchStripeSubs(LIVE_KEY, user.email),
        fetchStripeSubs(TEST_KEY, user.email)
    ]);

    const allSubs = [...liveSubs, ...testSubs];

    // Collect all custom item IDs across all subscriptions
    const allCustomItemIds = new Set<number>();
    allSubs.forEach(s => {
        if (s.metadata?.custom_cart) {
            try {
                const cart = JSON.parse(s.metadata.custom_cart);
                Object.keys(cart).forEach(id => allCustomItemIds.add(Number(id)));
            } catch {}
        }
    });

    // Fetch names for these items from Supabase
    const itemNames = await fetchItemNames(Array.from(allCustomItemIds));

    // Normalize
    const normalized = allSubs.map((s) => {
        let customItems: { name: string; quantity: number }[] = [];
        if (s.metadata?.custom_cart) {
            try {
                const cart = JSON.parse(s.metadata.custom_cart);
                customItems = Object.entries(cart).map(([id, qty]) => ({
                    name: itemNames[Number(id)] || "Produs",
                    quantity: Number(qty)
                }));
            } catch {}
        }

        return {
            id: s.id,
            status: s.status,
            cancel_at_period_end: s.cancel_at_period_end,
            current_period_end: s.current_period_end,
            created: s.created,
            latest_invoice: s.latest_invoice ?? null,
            is_test: !!s.__is_test_mode,
            items: s.items.data.map((it: any) => {
                return {
                    id: it.id,
                    quantity: it.quantity,
                    price: {
                        id: it.price.id, 
                        nickname: it.price.nickname, 
                        product_name: it.price.product_name ?? null, 
                        currency: it.price.currency,
                        unit_amount: it.price.unit_amount, 
                    },
                };
            }),
            custom_items: customItems,
            metadata: s.metadata, // <--- Pass all metadata found in Stripe
        };
    });

    return withCors(req, { headers: { "Content-Type": "application/json" } }, JSON.stringify({ subscriptions: normalized }));
});
