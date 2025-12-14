/// <reference types="jsr:@supabase/functions-js/edge-runtime.d.ts" />
import Stripe from "npm:stripe@14";

type Payload = { priceId: string; quantity?: number; customerEmail?: string; userId?: string; cart?: Record<string, number>; offer?: string; cartSummary?: string; };

const LIVE_KEY = Deno.env.get("STRIPE_SECRET_KEY")!;
const TEST_KEY = Deno.env.get("STRIPE_SECRET_KEY_TEST")!;

function getStripe(priceId: string) {
    // If the price starts with 'price_1Se...' (Test) or similar, using a simple prefix check or header is safer.
    // Actually, checking "price_..." doesn't distinguish environment.
    // Relying on the price exists check will fail if we check against wrong environment.
    // Better strategy: Use the Key that matches the request expectation.
    // We will check for "x-stripe-mode" header.
    return new Stripe(LIVE_KEY, { apiVersion: "2024-06-20" });
}

const FRONTEND_URL = Deno.env.get("FRONTEND_URL") ?? "http://localhost:5173";

// Add every origin you actually use (both www and apex!)
const ALLOWED = new Set<string>([
  FRONTEND_URL,                       // e.g. https://greenmart.ro
  "https://greenmart.ro",
  "https://www.greenmart.ro",
  "http://localhost:5173",
  "http://localhost:3000",
]);

function cors(req: Request) {
  const o = req.headers.get("origin") ?? "";
  const base = {
    "access-control-allow-methods": "POST,OPTIONS",
    "access-control-allow-headers": "content-type,x-stripe-mode,authorization",
    "access-control-max-age": "86400",
    "vary": "origin",
  };
  return ALLOWED.has(o) ? { "access-control-allow-origin": o, ...base } : base;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors(req) });
  if (req.method !== "POST") return new Response("Method Not Allowed", { status: 405, headers: cors(req) });

  let body: Payload;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "invalid_json" }), {
      status: 400, headers: { "content-type": "application/json", ...cors(req) },
    });
  }

  // quick input validation
  if (!body?.priceId || typeof body.priceId !== "string" || !body.priceId.startsWith("price_")) {
    return new Response(JSON.stringify({ error: "missing_or_invalid_priceId", received: body?.priceId }), {
      status: 400, headers: { "content-type": "application/json", ...cors(req) },
    });
  }
  const quantity = Number.isFinite(body.quantity) && (body.quantity as number) > 0 ? body.quantity! : 1;

  // Determine Mode
  const modeHeader = req.headers.get("x-stripe-mode");
  const isTest = modeHeader === "test";
  const stripe = new Stripe(isTest ? TEST_KEY : LIVE_KEY, { apiVersion: "2024-06-20" });

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",                  
      line_items: [{ price: body.priceId, quantity }],
      client_reference_id: body.userId ?? undefined,
      customer_email: body.customerEmail ?? undefined,
      billing_address_collection: "auto",
      payment_method_collection: "always",
      allow_promotion_codes: true,
      subscription_data: { 
        trial_from_plan: false,
        metadata: {
            custom_cart: JSON.stringify(body.cart || {}),
            offer: body.offer || "None",
            packing_summary: `Gift: ${body.offer || "None"} | ${body.cartSummary || "Standard Box"}` // <--- The Holy Grail for Packers
        }
      },
      success_url: `${FRONTEND_URL}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${FRONTEND_URL}/cancel`,
    });

    return new Response(JSON.stringify({ id: session.id, url: session.url }), {
      headers: { "content-type": "application/json", ...cors(req) },
    });
  } catch (e: any) {
    const err = e as Stripe.errors.StripeError;
    const debug = {
      message: err?.message ?? String(e),
      type: err?.type ?? null,
      code: (err as any)?.code ?? null,
      param: (err as any)?.param ?? null,
      requestId: (err as any)?.requestId ?? null,
      // helpful context:
      frontendUrl: FRONTEND_URL,
      origin: req.headers.get("origin"),
      priceId: body.priceId,
      quantity,
    };
    console.error("Stripe error:", debug);
    return new Response(JSON.stringify({ error: "stripe_error", debug }), {
      status: 400, headers: { "content-type": "application/json", ...cors(req) },
    });
  }
});
