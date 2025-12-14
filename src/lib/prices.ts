// Detect environment based on Mode
export const APP_MODE = import.meta.env.VITE_APP_MODE || "live";
const IS_TEST_MODE = APP_MODE === "test";

// LIVE IDs
const PRICE_CURATED_MEDIE_LIVE = import.meta.env.VITE_STRIPE_PRICE_BASIC_LIVE as string;      
const PRICE_CURATED_MARE_LIVE = import.meta.env.VITE_STRIPE_PRICE_PRO_LIVE as string;          
const PRICE_CUSTOM_MEDIE_LIVE = import.meta.env.VITE_STRIPE_PRICE_PRO_MIC_LIVE as string;   
const PRICE_CUSTOM_MARE_LIVE = import.meta.env.VITE_STRIPE_PRICE_PRO_MARE_LIVE as string; 

// TEST IDs (Fallbacks)
const PRICE_CURATED_MEDIE_TEST = import.meta.env.VITE_STRIPE_PRICE_BASIC_TEST as string;      
const PRICE_CURATED_MARE_TEST = import.meta.env.VITE_STRIPE_PRICE_PRO_TEST as string;          
const PRICE_CUSTOM_MEDIE_TEST = import.meta.env.VITE_STRIPE_PRICE_PRO_MIC_TEST as string;   
const PRICE_CUSTOM_MARE_TEST = import.meta.env.VITE_STRIPE_PRICE_PRO_MARE_TEST as string; 

export function getPriceId(planType: "Currated" | "Custom" | string, size: "Medie" | "Mare" | string): string {
    const isCustom = planType === "Custom";
    const isMare = size === "Mare";

    // Select set based on mode
    if (IS_TEST_MODE) {
        if (isCustom) return isMare ? PRICE_CUSTOM_MARE_TEST : PRICE_CUSTOM_MEDIE_TEST;
        return isMare ? PRICE_CURATED_MARE_TEST : PRICE_CURATED_MEDIE_TEST;
    }

    // Default to Live
    if (isCustom) return isMare ? PRICE_CUSTOM_MARE_LIVE : PRICE_CUSTOM_MEDIE_LIVE;
    return isMare ? PRICE_CURATED_MARE_LIVE : PRICE_CURATED_MEDIE_LIVE;
}
