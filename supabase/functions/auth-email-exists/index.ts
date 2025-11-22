// auth-email-exists.ts (or .js)

import express, { Request, Response } from "npm:express@5.1";
import { createClient, type User } from "npm:@supabase/supabase-js@2";

const app = express();

// Parse JSON body
app.use(express.json());

// Allow only your app origins
const FRONTEND_URL = process.env.FRONTEND_URL ?? "http://localhost:5173";
const ALLOWED = new Set<string>([FRONTEND_URL, "http://localhost:5173"]);

// CORS helper
function applyCors(req: Request, res: Response) {
    const origin = (req.headers.origin as string) ?? "";
    const allow = ALLOWED.has(origin) ? origin : "*";

    res.set({
        "access-control-allow-origin": allow,
        "access-control-allow-methods": "GET,POST,OPTIONS",
        "access-control-allow-headers": "content-type,authorization",
        "access-control-max-age": "86400",
        "vary": "origin",
    });
}

type Payload = { email?: string, table?: string };

// OPTIONS (preflight)
app.options("/auth-email-exists", (req, res) => {
    applyCors(req, res);
    res.send("ok");
});

// GET – simple health / info
app.get("/auth-email-exists", (req, res) => {
    applyCors(req, res);
    res.json({ ok: true, route: "/auth-email-exists" });
});

// POST – main logic
app.post("/auth-email-exists", async (req, res) => {
    applyCors(req, res);

    try {
        const ct = (req.headers["content-type"] || "").toString().toLowerCase();
        if (!ct.includes("application/json")) {
            return res
                .status(415)
                .json({ error: "Unsupported Content-Type. Use application/json." });
        }

        const body = req.body as Payload;
        const email = body?.email?.trim().toLowerCase();
        const table = body?.table;
        const valid = !!email && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);

        if (!valid) {
            return res
                .status(400)
                .json({ error: "Invalid or missing 'email' in JSON body." });
        }

        const url = process.env.SUPABASE_URL;
        const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
        if (!url || !key) {
            return res
                .status(500)
                .json({ error: "Server not configured (missing service secrets)" });
        }

        const admin = createClient(url, key);

        let exists = false;
        let confirmed = false;
        let completed_account = false;
        let id = "";
        const perPage = 200;
        if (!table) {
            for (let page = 1; page <= 3; page++) {
                const { data, error } = await admin.auth.admin.listUsers({
                    page,
                    perPage,
                });

                if (error) {
                    console.error("[auth-email-exists] admin.listUsers error:", error);
                    return res.status(502).json({ error: error.message });
                }

                const users: User[] = data?.users ?? [];
                const found = users.find(
                    (u) => (u.email || "").toLowerCase() === email
                );

                if (found) {
                    exists = true;
                    confirmed = !!found.email_confirmed_at;
                    break;
                }

                if (users.length < perPage) {
                    break; // no more pages
                }
            }
        } else {
            const { data, error } = await admin
                .from(table)
                .select("*")
                .eq("email", email)
                .limit(1)
                .maybeSingle();
            if (data) { exists = true; id = data.id; completed_account = data.completed_account; }

        }

        return res.json({ exists, confirmed, id, completed_account });
    } catch (e) {
        console.error("[auth-email-exists] exception:", e);
        return res.status(500).json({ error: String(e) });
    }
});

// Start server (adjust port as needed)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`auth-email-exists service running on port ${PORT}`);
});
