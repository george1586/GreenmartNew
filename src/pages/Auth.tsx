import { Header } from "../components/Header";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

export function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  // extra fields on sign-up
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const city = "Timișoara";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null); // <-- verification notice

  const navigate = useNavigate();

  // If already logged in, go home
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate("/");
    });
  }, [navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setNotice(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        // success -> go home
        navigate("/");
      } else {
        if (!phone.trim() || !address.trim()) {
          throw new Error("Please enter your phone number and address.");
        }

        // send confirmation email; user will be "signed up" but not active until verify
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin, // where Stripe/Site redirects after verify
            data: { phone, address, city },
          },
        });
        if (error) throw error;

        // show friendly notice & keep user on this page
        setNotice(
          `We’ve sent a verification email to ${email}. Please confirm your email to continue.`
        );
        // you may also clear password for safety
        setPassword("");
      }
    } catch (err: any) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  // resend verification (if user closed or lost the email)
  const resendVerification = async () => {
    try {
      setLoading(true);
      setError(null);
      // Supabase v2 resend for signup emails
      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
        options: { emailRedirectTo: window.location.origin },
      });
      if (error) throw error;
      setNotice(`Verification email re-sent to ${email}.`);
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
              {!isLogin && (
                <div className="mt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={resendVerification}
                    className="underline underline-offset-2 hover:text-emerald-900"
                    disabled={loading || !email}
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
                className="w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-farm-green"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-farm-green"
              />
            </div>

            {!isLogin && (
              <>
                <div>
                  <label className="block text-sm mb-1">Phone number</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+40 7xx xxx xxx"
                    className="w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-farm-green"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1">Address</label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Str. Exemplu nr. 10, bl. X, ap. Y"
                    className="w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-farm-green"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1">City</label>
                  <input
                    type="text"
                    value={city}
                    disabled
                    className="w-full border rounded-xl px-3 py-2 bg-gray-100 text-gray-600"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Livrăm doar în Timișoara în acest moment.
                  </p>
                </div>
              </>
            )}

            <button disabled={loading} className="btn btn-primary w-full">
              {loading ? "Please wait..." : (isLogin ? "Sign in" : "Sign up")}
            </button>
          </form>

          <button
            onClick={() => { setIsLogin(!isLogin); setError(null); setNotice(null); }}
            className="mt-4 text-sm text-farm-green hover:underline"
          >
            {isLogin ? "No account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </main>
    </>
  );
}
