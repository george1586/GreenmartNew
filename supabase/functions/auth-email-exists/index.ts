/// <reference types="jsr:@supabase/functions-js/edge-runtime.d.ts" />
import { createClient, type User } from "npm:@supabase/supabase-js@2";

// Allow only your app origins
const FRONTEND_URL = Deno.env.get("FRONTEND_URL") ?? "http://localhost:5173";
const ALLOWED = new Set<string>([FRONTEND_URL, "http://localhost:5173"]);

function cors(req: Request) {
    const origin = req.headers.get("origin") ?? "";
    const allow = ALLOWED.has(origin) ? origin : "*";
    return {
        "access-control-allow-origin": allow,
        "access-control-allow-methods": "GET,POST,OPTIONS",
        "access-control-allow-headers": "content-type,authorization",
        "access-control-max-age": "86400",
        "vary": "origin",
    };
}

type Payload = { email?: string };

Deno.serve(async (req) => {
    // CORS preflight
    if (req.method === "OPTIONS") return new Response("ok", { headers: cors(req) });

    // Health check (easy to test your route)
    if (req.method === "GET") {
        return new Response(JSON.stringify({ ok: true, route: "/auth-email-exists" }), {
            headers: { "content-type": "application/json", ...cors(req) },
        });
    }

    if (req.method !== "POST") {
        return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
            status: 405,
            headers: { "content-type": "application/json", ...cors(req) },
        });
    }

    try {
        const ct = (req.headers.get("content-type") || "").toLowerCase();
        if (!ct.includes("application/json")) {
            return new Response(JSON.stringify({ error: "Unsupported Content-Type. Use application/json." }), {
                status: 415,
                headers: { "content-type": "application/json", ...cors(req) },
            });
        }

        const body = (await req.json()) as Payload;
        const email = body?.email?.trim().toLowerCase();
        const valid = !!email && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
        if (!valid) {
            return new Response(JSON.stringify({ error: "Invalid or missing 'email' in JSON body." }), {
                status: 400,
                headers: { "content-type": "application/json", ...cors(req) },
            });
        }

        const url = Deno.env.get("SUPABASE_URL");
        const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
        if (!url || !key) {
            return new Response(JSON.stringify({ error: "Server not configured (missing service secrets)" }), {
                status: 500,
                headers: { "content-type": "application/json", ...cors(req) },
            });
        }

        const admin = createClient(url, key);

        // Search via Admin API (paged) for exact email match.
        // NOTE: This is O(n) over pages; fine for moderate user counts.
        let exists = false;
        let confirmed = false;

        const perPage = 200; // max page size supported
        for (let page = 1; page <= 50; page++) { // cap at 10k users scanned
            const { data, error } = await admin.auth.admin.listUsers({ page, perPage });
            if (error) {
                console.error("[auth-email-exists] admin.listUsers error:", error);
                return new Response(JSON.stringify({ error: error.message }), {
                    status: 502,
                    headers: { "content-type": "application/json", ...cors(req) },
                });
            }

            const users: User[] = data?.users ?? [];
            const found = users.find((u) => (u.email || "").toLowerCase() === email);

            if (found) {
                exists = true;
                confirmed = !!found.email_confirmed_at;
                break;
            }

            if (users.length < perPage) {
                // last page
                break;
            }
        }

        return new Response(JSON.stringify({ exists, confirmed }), {
            headers: { "content-type": "application/json", ...cors(req) },
        });
    } catch (e) {
        console.error("[auth-email-exists] exception:", e);
        return new Response(JSON.stringify({ error: String(e) }), {
            status: 500,
            headers: { "content-type": "application/json", ...cors(req) },
        });
    }
});
