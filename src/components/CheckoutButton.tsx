// src/components/CheckoutButton.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { fbqTrack } from "../lib/fbq";


type Props = {
  priceId: string;
  quantity?: number;
  customerEmail?: string | null;
  mode?: "subscription";
  label?: string;
};

export function CheckoutButton({ priceId, quantity = 1, customerEmail, mode = "subscription", label = "Cumpără" }: Props) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onClick = async () => {
    fbqTrack('InitiateCheckout', {
      value: 299.00,            // put the real price for that plan
      currency: 'RON',
      content_name: 'Green Box Mic',
      content_type: 'product',
    });
    setLoading(true);
    try {
      // 1) Require auth
      const { data } = await supabase.auth.getSession();
      const session = data.session;
      if (!session) {
        // Send to /auth and remember we wanted to checkout from #pricing
        navigate("/auth", {
          state: {
            // so the Auth page knows why it was opened
            notice: "Autentifică-te sau creează-ți contul pentru a continua la plată.",
            redirectTo: "/#pricing",
          },
          replace: true,
        });
        return;
      }

      // 2) Your existing checkout logic (example calling an Edge Function that creates a Stripe session)
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_FUNCTIONS_URL}/create-checkout-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          priceId,
          quantity,
          mode,
          customerEmail,
          // optionally pass a success/cancel URL as well
          success_url: `${window.location.origin}/thank-you`,
          cancel_url: `${window.location.origin}/cancel`,
        }),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(txt || `Checkout failed (${res.status})`);
      }

      const { url } = await res.json();
      if (!url) throw new Error("Stripe URL missing from response");
      window.location.href = url;
    } catch (err) {
      console.error(err);
      alert("Nu am putut iniția checkout-ul. Încearcă din nou.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="btn btn-primary w-full"
    >
      {loading ? "Se încarcă…" : label}
    </button>
  );
}
