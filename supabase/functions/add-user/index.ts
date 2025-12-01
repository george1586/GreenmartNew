
import { createClient } from "npm:@supabase/supabase-js@2";

const FRONTEND_URL = Deno.env.get("FRONTEND_URL") ?? "http://localhost:5173";
const ALLOWED_ORIGINS = new Set<string>([
    FRONTEND_URL,
    "http://localhost:5173",
]);

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

const supabaseAdmin =
    SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY
        ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            },
        })
        : null;

function buildCorsHeaders(origin: string | null): Headers {
    const headers = new Headers();

    const allowOrigin = origin && ALLOWED_ORIGINS.has(origin) ? origin : "*";

    headers.set("access-control-allow-origin", allowOrigin);
    headers.set(
        "access-control-allow-methods",
        "GET,POST,PUT,DELETE,OPTIONSS",
    );
    headers.set(
        "access-control-allow-headers",
        "content-type,authorization",
    );
    headers.set("access-control-max-age", "86400");
    headers.set("vary", "origin");

    return headers;
}

Deno.serve(async (req) => {
    const url = new URL(req.url);
    const origin = req.headers.get("origin");
    const corsHeaders = buildCorsHeaders(origin);

    if (req.method === "OPTIONS") {
        return new Response(null, {
            status: 204,
            headers: corsHeaders,
        });
    }

    if (url.pathname !== "/add-user") {
        return new Response(
            JSON.stringify({ error: "Not found" }),
            {
                status: 404,
                headers: {
                    ...Object.fromEntries(corsHeaders),
                    "content-type": "application/json",
                },
            },
        );
    }

    if (req.method === "GET") {
        return new Response(
            JSON.stringify({ ok: true, route: "/update-user" }),
            {
                status: 200,
                headers: {
                    ...Object.fromEntries(corsHeaders),
                    "content-type": "application/json",
                },
            },
        );
    }

    if (req.method === "POST") {
        try {
            if (!supabaseAdmin) {
                return new Response(
                    JSON.stringify({
                        error: "Server not configured (missing Supabase env vars)",
                    }),
                    {
                        status: 500,
                        headers: {
                            ...Object.fromEntries(corsHeaders),
                            "content-type": "application/json",
                        },
                    },
                );
            }

            const contentType = req.headers.get("content-type") ?? "";
            if (!contentType.toLowerCase().includes("application/json")) {
                return new Response(
                    JSON.stringify({
                        error: "Unsupported Content-Type. Use application/json.",
                    }),
                    {
                        status: 415,
                        headers: {
                            ...Object.fromEntries(corsHeaders),
                            "content-type": "application/json",
                        },
                    },
                );
            }

            const body = await req.json().catch(() => null) as {
                email?: string;
                table?: string;
                offer?: string;
            } | null;

            const offer = body?.offer;
            const email = body?.email;
            const table = body?.table;

            if (typeof offer === "undefined") {
                return new Response(
                    JSON.stringify({ error: "Missing 'offer' in request body" }),
                    {
                        status: 400,
                        headers: {
                            ...Object.fromEntries(corsHeaders),
                            "content-type": "application/json",
                        },
                    },
                );
            }

            const { data, error } = await supabaseAdmin.from(table).insert([{ email, offer }]);


            if (error) {
                console.error("[update-user] Supabase error:", error);
                return new Response(
                    JSON.stringify({ error: error.message }),
                    {
                        status: 502,
                        headers: {
                            ...Object.fromEntries(corsHeaders),
                            "content-type": "application/json",
                        },
                    },
                );
            }

            return new Response(
                JSON.stringify({ message: "Created succesfully", id: data?.[0]?.id }),
                {
                    status: 200,
                    headers: {
                        ...Object.fromEntries(corsHeaders),
                        "content-type": "application/json",
                    },
                },
            );
        } catch (e) {
            console.error("[update-user] exception:", e);
            return new Response(
                JSON.stringify({ error: String(e) }),
                {
                    status: 500,
                    headers: {
                        ...Object.fromEntries(corsHeaders),
                        "content-type": "application/json",
                    },
                },
            );
        }
    }

    return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        {
            status: 405,
            headers: {
                ...Object.fromEntries(corsHeaders),
                "content-type": "application/json",
            },
        },
    );
});
