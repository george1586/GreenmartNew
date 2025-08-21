/// <reference types="jsr:@supabase/functions-js/edge-runtime.d.ts" />
import Stripe from "npm:stripe@14";

type Payload = {
  priceId: string;
  quantity?: number;
  customerEmail?: string;
};

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2024-06-20",
});

const FRONTEND_URL = Deno.env.get("FRONTEND_URL") ?? "http://localhost:5173";

function corsHeaders(origin = "*") {
  return {
    "access-control-allow-origin": origin,
    "access-control-allow-methods": "POST,OPTIONS",
    "access-control-allow-headers": "authorization,content-type",
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders() });

  try {
    const { priceId, quantity = 1, customerEmail } = (await req.json()) as Payload;

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      // collect a card now (so Stripe can charge immediately and later)
      payment_method_collection: "always",
      // make sure no trial is applied from the price
      subscription_data: {
        trial_from_plan: false,
      },
      line_items: [{ price: priceId, quantity }],
      customer_email: customerEmail,
      billing_address_collection: "required",
      phone_number_collection: { enabled: true },
      allow_promotion_codes: true,
      success_url: `${FRONTEND_URL}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${FRONTEND_URL}/cancel`,
    });

    return new Response(JSON.stringify({ id: session.id }), {
      headers: { "content-type": "application/json", ...corsHeaders() },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 400,
      headers: { "content-type": "application/json", ...corsHeaders() },
    });
  }
});
