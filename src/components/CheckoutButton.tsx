import { stripePromise } from "../lib/stripe";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

type Props = {
  priceId: string;
  quantity?: number;
  mode?: "subscription";
  customerEmail?: string | null;
  label?: string;
};

export function CheckoutButton({
  priceId,
  quantity = 1,
  mode = "subscription",
  customerEmail,
  label,
}: Props) {
  const navigate = useNavigate();

  const onClick = async () => {
    // If there’s no email (i.e., user is logged out), send to /auth
    if (!customerEmail) {
      // optional: remember they wanted to buy – you could store priceId in sessionStorage
      navigate("/auth");
      return;
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_FUNCTIONS_URL}/create-checkout-session`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ priceId, quantity, mode, customerEmail }),
        }
      );
      const data = await res.json();
      if (!data.id) throw new Error(data.error || "Failed to create checkout session");

      const stripe = await stripePromise;
      const { error } = await stripe!.redirectToCheckout({ sessionId: data.id });
      if (error) alert(error.message);
    } catch (e: any) {
      alert(e.message || String(e));
    }
  };

  return (
    <button onClick={onClick} className="btn btn-primary w-full">
      {label ?? "Choose"}
    </button>
  );
}
