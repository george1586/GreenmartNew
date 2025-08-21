/// <reference types="jsr:@supabase/functions-js/edge-runtime.d.ts" />
import Stripe from "npm:stripe@14";

type Payload = {
  priceId: string;
  quantity?: number;
  customerEmail?: string;
  userId?: string;
};

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2024-06-20",
});

// allow-list origins (add your prod domain in secret FRONTEND_URL if needed)
const FRONTEND_URL = Deno.env.get("FRONTEND_URL") ?? "http://localhost:5173";
const ALLOWED = new Set<string>([FRONTEND_URL, "http://localhost:5173"]);

function cors(req: Request) {
  const o = req.headers.get("origin") ?? "";
  const allow = ALLOWED.has(o) ? o : "*";
  return {
    "access-control-allow-origin": allow,
    "access-control-allow-methods": "POST,OPTIONS",
    "access-control-allow-headers": "authorization,content-type",
    "access-control-max-age": "86400",
    "vary": "origin",
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors(req) });
  if (req.method !== "POST") return new Response("Method Not Allowed", { status: 405, headers: cors(req) });

  try {
    const body = (await req.json()) as Payload;
    console.log("create-checkout-session payload:", body); // visible in logs

    // Basic validation
    if (!body?.priceId || typeof body.priceId !== "string") {
      return new Response(JSON.stringify({ error: "Missing or invalid priceId" }), {
        status: 400, headers: { "content-type": "application/json", ...cors(req) },
      });
    }
    const quantity = Number.isFinite(body.quantity) && (body.quantity as number) > 0 ? body.quantity : 1;

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_collection: "always",
      subscription_data: { trial_from_plan: false },
      client_reference_id: body.userId,
      line_items: [{ price: body.priceId, quantity }],
      customer_email: body.customerEmail,
      billing_address_collection: "auto",
      phone_number_collection: { enabled: false },
      allow_promotion_codes: true,
      success_url: `${FRONTEND_URL}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${FRONTEND_URL}/cancel`,
    });

    return new Response(JSON.stringify({ id: session.id }), {
      headers: { "content-type": "application/json", ...cors(req) },
    });
  } catch (e: any) {
    // Surface Stripe error details
    const err = e as Stripe.errors.StripeError;
    const details = {
      type: err?.type ?? "unknown_error",
      message: err?.message ?? String(e),
      code: (err as any)?.code ?? null,
      param: (err as any)?.param ?? null,
      requestId: (err as any)?.requestId ?? null,
    };
    console.error("Stripe error:", details);
    return new Response(JSON.stringify({ error: "stripe_error", details }), {
      status: 400,
      headers: { "content-type": "application/json", ...cors(req) },
    });
  }
});
