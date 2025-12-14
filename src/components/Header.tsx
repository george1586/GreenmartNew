// src/components/Header.tsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Home, Menu, X, LogIn, LogOut, Mail, Leaf, CreditCard, User } from "lucide-react";
import { supabase } from "../lib/supabase";
import { Button } from "./ui/Button";

export function Header() {
  const [email, setEmail] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setEmail(data.session?.user.email ?? null);
    });
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
    navigate("/");
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/95 backdrop-blur-sm shadow-sm transition-all">
      <div className="mx-auto flex h-20 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
        
        {/* LOGO */}
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center group">
            <div className="relative flex items-center justify-center w-10 h-10 bg-farm-green/10 rounded-xl group-hover:bg-farm-green/20 transition-colors mr-2">
               <Leaf className="h-6 w-6 text-farm-green" aria-hidden="true" />
            </div>
            <div className="flex flex-col -gap-1">
                <span className="text-2xl font-display font-extrabold text-farm-dark leading-none tracking-tight">Green<span className="text-farm-green">Mart</span></span>
            </div>
          </Link>
        </div>

        {/* DESKTOP NAV */}
        <div className="ml-auto hidden md:flex items-center gap-4">
          {email ? (
            <>
              <Link to="/subscriptii">
                <Button variant="ghost" size="sm" className="gap-2">
                    <CreditCard className="h-4 w-4" />
                    Abonamente
                </Button>
              </Link>
              
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-100 text-sm font-medium text-gray-600">
                <User className="h-3.5 w-3.5" />
                {email}
              </div>

              <Button variant="secondary" size="sm" onClick={handleSignOut} className="gap-2">
                <LogOut className="h-4 w-4" />
                Sign out
              </Button>
            </>
          ) : (
            <Link to="/auth">
               <Button variant="primary" size="sm" className="gap-2 px-6">
                 <LogIn className="h-4 w-4" />
                 Login
               </Button>
            </Link>
          )}
        </div>

        {/* MOBILE TOGGLE */}
        <button
          className="ml-auto inline-flex items-center justify-center rounded-xl p-2 md:hidden hover:bg-gray-100 text-gray-600"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* MOBILE DRAWER */}
      <div
        className={`md:hidden border-t bg-white transition-[max-height] duration-300 overflow-hidden ${open ? "max-h-96 shadow-lg" : "max-h-0"
          }`}
      >
        <nav className="flex flex-col gap-2 px-4 py-4">
          <Link
            onClick={() => setOpen(false)}
            to="/"
            className="flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-gray-50 font-medium text-gray-700"
          >
            <Home className="h-5 w-5 text-farm-green" />
            Acasă
          </Link>

          {email && (
            <Link
              onClick={() => setOpen(false)}
              to="/subscriptii"
              className="flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-gray-50 font-medium text-gray-700"
            >
              <CreditCard className="h-5 w-5 text-farm-green" />
              Abonamente
            </Link>
          )}

          <div className="my-2 h-px bg-gray-100" />

          {email ? (
            <>
              <div className="flex items-center gap-3 px-4 py-2 text-sm text-gray-500">
                <Mail className="h-4 w-4" />
                <span className="truncate">{email}</span>
              </div>
              <Button variant="secondary" onClick={handleSignOut} className="w-full justify-start gap-3 mt-2">
                  <LogOut className="h-4 w-4" />
                  Sign out
              </Button>
            </>
          ) : (
            <Link to="/auth" onClick={() => setOpen(false)}>
                <Button variant="primary" className="w-full justify-center gap-2 mt-2">
                     <LogIn className="h-4 w-4" />
                     Login
                </Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
