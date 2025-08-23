// src/components/Header.tsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, LogIn, LogOut, Mail, Leaf } from "lucide-react";
import { supabase } from "../lib/supabase";

export function Header() {
  const [email, setEmail] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // initial session
    supabase.auth.getSession().then(({ data }) => {
      setEmail(data.session?.user.email ?? null);
    });
    // subscribe to auth changes
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user.email ?? null);
    });
    return () => {
      sub.subscription.unsubscribe();
    };
  }, []);

  async function handleSignOut() {
    await supabase.auth.signOut();
    setOpen(false);
    navigate("/"); // send user home after sign out
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
        {/* Left: brand */}
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center">
            <Leaf className="h-6 w-6 mr-1" aria-hidden="true" />
            <span className="text-xl font-bold text-farm-dark">Green</span><span className="text-xl font-bold text-farm-green">Mart</span>
          </Link>
        </div>

        {/* Center: nav (add links if needed) */}

        {/* Right: desktop actions */}
        <div className="ml-auto hidden md:flex items-center gap-3">
          {email ? (
            <>
              <span className="inline-flex items-center gap-2 rounded-md bg-gray-100 px-2.5 py-1.5 text-sm">
                <Mail className="h-4 w-4" />
                {email}
              </span>
              <button
                onClick={handleSignOut}
                className="inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-700"
            >
              <LogIn className="h-4 w-4" />
              Login
            </Link>
          )}
        </div>

        {/* Mobile burger */}
        <button
          className="ml-auto inline-flex items-center justify-center rounded-md p-2 md:hidden hover:bg-gray-100"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile drawer */}
      <div
        className={`md:hidden border-t bg-white transition-[max-height] duration-300 overflow-hidden ${open ? "max-h-96" : "max-h-0"
          }`}
      >
        {/* <nav className="flex flex-col gap-1 px-4 py-3">
          <Link onClick={() => setOpen(false)} to="/" className="rounded-md px-2 py-2 hover:bg-gray-50">
            Acasă
          </Link>
          <Link onClick={() => setOpen(false)} to="/preturi" className="rounded-md px-2 py-2 hover:bg-gray-50">
            Prețuri
          </Link>
          <Link onClick={() => setOpen(false)} to="/despre" className="rounded-md px-2 py-2 hover:bg-gray-50">
            Despre
          </Link> */}

        <div className="my-2 h-px bg-gray-200" />

        {email ? (
          <>
            <div className="flex items-center gap-2 rounded-md bg-gray-100 px-2.5 py-2 text-sm">
              <Mail className="h-4 w-4" />
              <span className="truncate">{email}</span>
            </div>
            <button
              onClick={handleSignOut}
              className="mt-2 inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-gray-50"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </>
        ) : (
          <Link
            to="/auth"
            onClick={() => setOpen(false)}
            className="mt-1 inline-flex items-center gap-2 rounded-lg bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700"
          >
            <LogIn className="h-4 w-4" />
            Login
          </Link>
        )}
      </nav>
    </div>
    </header >
  );
}
