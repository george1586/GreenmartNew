// src/components/Header.tsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Home, Menu, X, LogIn, LogOut, Mail, Leaf, CreditCard } from "lucide-react";
import { supabase } from "../lib/supabase";

type HeaderProps = {
  /** Dacă true, header-ul e fixed + transparent peste hero, cu text alb.
   *  Devine opac la scroll sau când e deschis meniul mobil. */
  overlay?: boolean;
};

export function Header({ overlay = false }: HeaderProps) {
  const [email, setEmail] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setEmail(data.session?.user.email ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user.email ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!overlay) return;
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [overlay]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    setOpen(false);
    navigate("/");
  }

  // overlay activ doar dacă e pagina de tip hero și NU e scroll și NU e drawer deschis
  const overlayActive = overlay && !scrolled && !open;

  // clase pentru container (fundal/border)
  const headerBase =
    "fixed top-0 z-40 w-full transition-colors duration-200";
  const headerOverlay =
    "border-b-0 border-transparent bg-transparent";
  const headerSolid =
    "border-b-0 bg-transparent backdrop-blur";

  // pentru text/linkuri pe fundal închis (alb) vs. normal
  const brandTextClass = overlayActive ? "text-white" : "text-farm-dark";
  const iconColorClass = overlayActive ? "text-white" : "text-farm-dark";

  // butoane desktop (Login / Abonamente / Sign out)
  const btnBorder =
    "inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm transition-colors";
  const btnBorderOverlay =
    "border-white/70 text-white hover:bg-white/10";
  const btnBorderSolid =
    "border text-farm-dark hover:bg-gray-50";

  const badgeEmail =
    overlayActive
      ? "inline-flex items-center gap-2 rounded-md bg-white/15 px-2.5 py-1.5 text-sm text-white"
      : "inline-flex items-center gap-2 rounded-md bg-gray-100 px-2.5 py-1.5 text-sm";

  const loginBtn =
    overlayActive
      ? "inline-flex items-center gap-2 rounded-lg bg-white/20 px-3 py-1.5 text-sm font-medium text-white hover:bg-white/30"
      : "inline-flex items-center gap-2 rounded-lg bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-700";

  const burgerBtn =
    overlayActive
      ? "ml-auto inline-flex items-center justify-center rounded-md p-2 md:hidden hover:bg-white/10 text-white"
      : "ml-auto inline-flex items-center justify-center rounded-md p-2 md:hidden hover:bg-gray-100";

  // culoarea icon-urilor
  const Icon = (props: any) => {
    const { className = "", ...rest } = props;
    return <Leaf className={`h-6 w-6 mr-1 ${overlayActive ? "text-white" : "text-farm-dark"} ${className}`} {...rest} />;
  };

  return (
    <header className={`${headerBase} ${overlayActive ? headerOverlay : headerSolid}`}>
      <div className="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
        {/* Left: brand */}
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center">
            <Icon aria-hidden="true" />
            <span className={`text-xl font-bold ${brandTextClass}`}>Green</span>
            <span className={`text-xl font-bold text-farm-green`}>Mart</span>
          </Link>
        </div>

        {/* Right: desktop actions */}
        <div className="ml-auto hidden md:flex items-center gap-3">
          {email ? (
            <>
              <Link
                to="/subscriptii"
                className={`${btnBorder} ${overlayActive ? btnBorderOverlay : btnBorderSolid}`}
              >
                <CreditCard className={`h-4 w-4 ${overlayActive ? "text-white" : "text-farm-dark"}`} />
                Abonamente
              </Link>
              <span className={badgeEmail}>
                <Mail className="h-4 w-4" />
                {email}
              </span>
              <button
                onClick={handleSignOut}
                className={`${btnBorder} ${overlayActive ? btnBorderOverlay : btnBorderSolid}`}
              >
                <LogOut className={`h-4 w-4 ${overlayActive ? "text-white" : "text-farm-dark"}`} />
                Sign out
              </button>
            </>
          ) : (
            <Link to="/auth" className={loginBtn}>
              <LogIn className="h-4 w-4" />
              Contul meu
            </Link>
          )}
        </div>

        {/* Mobile burger */}
        <button
          className={burgerBtn}
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile drawer */}
      <div
        className={`md:hidden transition-[max-height] duration-300 overflow-hidden 
          ${open ? "max-h-96 bg-transparent" : "max-h-0 bg-transparent"}
        `}
      >
        <nav className="flex flex-col gap-1 px-4 py-3 text-farm-dark">
          <Link
            onClick={() => setOpen(false)}
            to="/"
            className="rounded-md px-2 py-2 hover:bg-gray-50 inline-flex items-center gap-2"
          >
            <Home className="h-4 w-4" />
            Acasă
          </Link>

          {email && (
            <Link
              onClick={() => setOpen(false)}
              to="/subscriptii"
              className="rounded-md px-2 py-2 hover:bg-gray-50 inline-flex items-center gap-2"
            >
              <CreditCard className="h-4 w-4" />
              Abonamente
            </Link>
          )}

          <div className="my-2 h-px bg-gray-200" />

          {email ? (
            <>
              <div className="flex items-center gap-2 rounded-md bg-gray-100 px-2.5 py-2 text-sm">
                <Mail className="h-4 w-4" />
                <span className="truncate">{email}</span>
              </div>
              <button
                onClick={handleSignOut}
                className="mt-2 inline-flex items-center gap-2 rounded-lg border-0 px-3 py-2 text-sm hover:bg-gray-50"
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
              Contul meu
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
