import { loadStripe } from "@stripe/stripe-js";

// Determine active key based on mode
const mode = import.meta.env.VITE_APP_MODE || "live";
const key = mode === "test" 
    ? import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY_TEST 
    : import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY_LIVE;

if (!key) {
    console.warn(`Stripe Publishable Key is missing for mode: ${mode}`);
}

export const stripePromise = loadStripe(key as string);
