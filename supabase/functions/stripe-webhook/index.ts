/// <reference types="jsr:@supabase/functions-js/edge-runtime.d.ts" />

import Stripe from "npm:stripe@14";
import { createClient } from "npm:@supabase/supabase-js@2";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2024-06-20",
});

const endpointSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET")!;
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const serviceRole = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const sb = createClient(supabaseUrl, serviceRole);

Deno.serve(async (req) => {
  const signature = req.headers.get("stripe-signature") ?? "";
  const raw = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, signature, endpointSecret);
  } catch (err) {
    return new Response(`Webhook Error: ${err}`, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const s = event.data.object as Stripe.Checkout.Session;

      const email = s.customer_details?.email ?? null;
      let customer_id: string | null = null;

      if (email) {
        const { data: cust } = await sb
          .from("customers")
          .upsert(
            {
              email,
              stripe_customer_id:
                typeof s.customer === "string" ? s.customer : null,
            },
            { onConflict: "email" }
          )
          .select()
          .single();

        customer_id = cust?.id ?? null;
      }

      await sb.from("orders").insert({
        stripe_payment_intent_id:
          typeof s.payment_intent === "string" ? s.payment_intent : null,
        stripe_checkout_session_id: s.id,
        customer_id,
        amount_total: s.amount_total ?? 0,
        currency: s.currency ?? "ron",
        status: s.payment_status ?? "paid",
      });

      break;
    }
    default:
      break;
    case "invoice.payment_succeeded": {
      const inv = event.data.object as Stripe.Invoice;
      // Example: upsert in `subscriptions`
      await sb.from("subscriptions").upsert({
        stripe_subscription_id: typeof inv.subscription === "string" ? inv.subscription : null,
        status: "active",
        current_period_end: new Date(inv.lines.data[0]?.period?.end! * 1000).toISOString()
      }, { onConflict: "stripe_subscription_id" });
      break;
    }

  }

  return new Response("ok", { status: 200 });
});
