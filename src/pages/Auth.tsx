import { Header } from "../components/Header";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate, useLocation } from "react-router-dom";

export function Auth() {
  const [isLogin, setIsLogin] = useState(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const city = "Timișoara";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [canResend, setCanResend] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // 👉 Dacă venim redirectați din signup cu mesaj în state
  useEffect(() => {
    if (location.state?.notice) {
      setNotice(location.state.notice);
      setIsLogin(true); // forțăm login view
    }
  }, [location.state]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setCanResend(false);

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          setError(error.message);
          return;
        }
        if (!data?.session) {
          setError("Login failed: no session returned (is the email verified?).");
          return;
        }
        navigate("/");
        return;
      }

      // --- SIGN UP flow ---
      if (!fullName.trim() || !phone.trim() || !address.trim()) {
        throw new Error("Completează nume, telefon și adresă.");
      }

      const resp = await fetch(
        `${import.meta.env.VITE_SUPABASE_FUNCTIONS_URL}/auth-email-exists`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );
      if (!resp.ok) throw new Error("Email check failed");
      const check: { exists?: boolean; confirmed?: boolean } = await resp.json();
      if (check.exists) {
        setNotice(
          check.confirmed
            ? `Există deja un cont pe ${email}. Autentifică-te.`
            : `Există deja un cont neconfirmat pe ${email}. Verifică inbox-ul sau apasă „Resend email”.`
        );
        setCanResend(!check.confirmed);
        setPassword("");
        return;
      }

      const { error: suErr } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
          data: { full_name: fullName, phone, address, city },
        },
      });
      if (suErr) throw suErr;

      // 👉 După signup, mergem pe Login cu notificare
      navigate("/auth", {
        state: { notice: `Ți-am trimis un email de verificare la ${email}.` },
      });
    } catch (err: any) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  const resendVerification = async () => {
    try {
      setLoading(true);
      setError(null);
      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
        options: { emailRedirectTo: window.location.origin },
      });
      if (error) throw error;
      setNotice(`Am retrimis emailul de verificare la ${email}.`);
    } catch (err: any) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="max-w-md mx-auto px-4 py-16">
        <div className="card p-8">
          <h1 className="text-2xl font-bold text-farm-dark mb-4">
            {isLogin ? "Sign in" : "Create account"}
          </h1>

          {notice && (
            <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800 p-3 text-sm">
              {notice}
              {!isLogin && canResend && (
                <div className="mt-2">
                  <button
                    type="button"
                    onClick={resendVerification}
                    className="underline underline-offset-2 hover:text-emerald-900"
                    disabled={loading}
                  >
                    Resend email
                  </button>
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 text-red-700 p-3 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border rounded-xl px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border rounded-xl px-3 py-2"
              />
            </div>

            {!isLogin && (
              <>
                <div>
                  <label className="block text-sm mb-1">Numele Complet</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full border rounded-xl px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Numărul de telefon</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full border rounded-xl px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Adresa completă</label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full border rounded-xl px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Oraș</label>
                  <input
                    type="text"
                    value={city}
                    disabled
                    className="w-full border rounded-xl px-3 py-2 bg-gray-100 text-gray-600"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Livrăm doar în Timișoara.
                  </p>
                </div>
              </>
            )}

            <button disabled={loading} className="btn btn-primary w-full">
              {loading ? "Please wait..." : isLogin ? "Sign in" : "Sign up"}
            </button>
          </form>

          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError(null);
              setNotice(null);
              setCanResend(false);
            }}
            className="mt-4 text-sm text-farm-green hover:underline"
          >
            {isLogin ? "Nu ai cont? Înregistrează-te" : "Ai deja un cont? Conectează-te"}
          </button>
        </div>
      </main>
    </>
  );
}
