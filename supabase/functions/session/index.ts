const FRONTEND_URL = "http://localhost:5173";

interface Session {
    anonymous?: boolean;
    userId?: number;
    email?: string;
    size?: string;
    freq?: number;
    offer?: string;
    plan?: string;
}

const ONE_DAY = 24 * 60 * 60; // seconds
const THIRTY_DAYS = 30 * ONE_DAY;
const SESSION_COOKIE_NAME = "session";

const corsHeaders: Record<string, string> = {
    "Access-Control-Allow-Origin": FRONTEND_URL,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Methods": "GET,POST,PATCH,OPTIONS",
};

function parseCookies(header: string | null): Record<string, string> {
    if (!header) return {};
    return header.split(";").reduce((acc, part) => {
        const [k, v] = part.trim().split("=");
        if (!k) return acc;
        acc[k] = decodeURIComponent(v ?? "");
        return acc;
    }, {} as Record<string, string>);
}

function parseSessionCookie(raw: string | undefined): Session {
    if (!raw) return { anonymous: true };
    try {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") return parsed as Session;
    } catch {
    }
    return { anonymous: true };
}

function getCookieMaxAge(session: Session): number {
    return session.userId ? THIRTY_DAYS : ONE_DAY;
}

function buildSetCookieHeader(session: Session): string {
    const value = encodeURIComponent(JSON.stringify(session));
    const maxAge = getCookieMaxAge(session);
    const secure = Deno.env.get("ENV") === "production";

    const parts = [
        `${SESSION_COOKIE_NAME}=${value}`,
        `Max-Age=${maxAge}`,
        "HttpOnly",
        "SameSite=None",
        "Secure",
        "Partitioned",
    ];
    if (secure) parts.push("Secure");

    return parts.join("; ");
}

function jsonResponse(
    body: unknown,
    init: ResponseInit = {}
): Response {
    const headers = new Headers(init.headers);
    Object.entries(corsHeaders).forEach(([k, v]) => headers.set(k, v));
    headers.set("Content-Type", "application/json");
    return new Response(JSON.stringify(body), {
        ...init,
        headers,
    });
}

Deno.serve(async (req: Request) => {
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    const url = new URL(req.url);

    const pathname = url.pathname.replace(/^\/session/, "") || "/";

    const cookieHeader = req.headers.get("cookie");
    const cookies = parseCookies(cookieHeader);
    let session = parseSessionCookie(cookies[SESSION_COOKIE_NAME]);

    if (req.method === "GET" && pathname === "/") {
        const headers = new Headers(corsHeaders);
        headers.append("Set-Cookie", buildSetCookieHeader(session));
        return new Response(JSON.stringify(session), {
            status: 200,
            headers,
        });
    }

    if (req.method === "PATCH" && pathname === "/") {
        const body = (await req.json().catch(() => ({}))) as Partial<Session>;
        session = { ...session, ...body };
        const headers = new Headers(corsHeaders);
        headers.append("Set-Cookie", buildSetCookieHeader(session));
        return new Response(JSON.stringify(session), {
            status: 200,
            headers,
        });
    }

    if (req.method === "POST" && pathname === "/check") {
        const body = (await req.json().catch(() => ({}))) as {
            requiredFields?: (keyof Session)[];
        };
        const requiredFields = body.requiredFields ?? [];
        const valid = requiredFields.every(
            (field) =>
                session[field] !== undefined &&
                session[field] !== null
        );

        const headers = new Headers(corsHeaders);
        headers.append("Set-Cookie", buildSetCookieHeader(session));

        return new Response(JSON.stringify({ valid }), {
            status: 200,
            headers,
        });
    }

    return jsonResponse({ error: "Not found" }, { status: 404 });
});
