import React, { useEffect, useState, ReactNode } from "react";
import { supabase } from "../lib/supabase";
import { Navigate } from "react-router-dom";

// pune aici mailul tău sau o listă de mailuri admin
const ALLOWED_EMAILS = [
    "george_ichim101@yahoo.com",
    "admin@greenmart.ro"
    // <- schimbă cu email-ul tău
];

type AdminGuardProps = {
    children: ReactNode;
};

type GuardStatus = "loading" | "allowed" | "denied" | "unauthenticated";

export const AdminGuard: React.FC<AdminGuardProps> = ({ children }) => {
    const [status, setStatus] = useState<GuardStatus>("loading");

    useEffect(() => {
        const checkUser = async () => {
            const { data, error } = await supabase.auth.getUser();

            if (error) {
                console.error("Error getting user", error);
                setStatus("unauthenticated");
                return;
            }

            const user = data.user;

            if (!user) {
                setStatus("unauthenticated");
                return;
            }

            const email = user.email?.toLowerCase() ?? "";

            if (ALLOWED_EMAILS.map((e) => e.toLowerCase()).includes(email)) {
                setStatus("allowed");
            } else {
                setStatus("denied");
            }
        };

        checkUser();
    }, []);

    if (status === "loading") {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50">
                <div className="rounded-xl bg-white px-4 py-3 text-sm text-slate-600 shadow">
                    Checking admin access…
                </div>
            </div>
        );
    }

    // nu e logat -> trimitem la login (sau altundeva)
    if (status === "unauthenticated") {
        return <Navigate to="/login" replace />;
    }

    // logat, dar nu e admin -> 403
    if (status === "denied") {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
                <div className="max-w-md rounded-2xl bg-white p-6 text-center shadow">
                    <h1 className="mb-2 text-lg font-semibold text-slate-900">
                        403 – Access denied
                    </h1>
                    <p className="mb-4 text-sm text-slate-600">
                        You don&apos;t have permission to view this page.
                    </p>
                    <a
                        href="/"
                        className="inline-flex rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
                    >
                        Go back home
                    </a>
                </div>
            </div>
        );
    }

    return <>{children}</>;
};
