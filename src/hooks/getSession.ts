import { Session } from "@supabase/supabase-js";

export async function getSession() {
    const res = await fetch(`${import.meta.env.VITE_SUPABASE_FUNCTIONS_URL}/session`, {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!res.ok) throw new Error("Failed to load session");
    return (await res.json());
}


