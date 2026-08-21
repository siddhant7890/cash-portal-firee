import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login, user, ready } = useAuth();
  const [mobile, setMobile] = useState("");
  const [loginCode, setLoginCode] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Already logged in (token still in localStorage) — skip straight past login.
  useEffect(() => {
    if (ready && user) {
      router.replace("/cash-counter");
    }
  }, [ready, user, router]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(mobile, loginCode);
      router.push("/cash-counter");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Head>
        <title>Login — Shama Fireworks Cash Portal</title>
      </Head>
      <div className="sf-login-wrap">
        <div className="sf-login-card">
          <div className="sf-login-logo">
            <img src="/shama-fireworks-logo.jpeg" alt="Shama Fireworks logo" />
          </div>
          <div className="font-display fw-semibold" style={{ fontSize: 20 }}>
            Shama Fireworks
          </div>
          <div style={{ fontSize: 13.5, color: "var(--ink-soft)", marginBottom: 24 }}>
            Cash Portal Login
          </div>

          <form onSubmit={handleSubmit} className="text-start">
            <div className="sf-field mb-3">
              <label>Mobile number</label>
              <input
                type="tel"
                inputMode="numeric"
                maxLength={10}
                className="form-control"
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                placeholder="98765 43210"
                required
              />
            </div>
            <div className="sf-field mb-3">
              <label>Login code</label>
              <input
                type="password"
                inputMode="numeric"
                className="form-control"
                value={loginCode}
                onChange={(e) => setLoginCode(e.target.value)}
                placeholder="••••"
                required
              />
            </div>

            {error && (
              <div className="mb-3" style={{ fontSize: 12.5, color: "var(--danger)" }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              className="sf-btn sf-btn-primary w-100 justify-content-center"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Login"}
            </button>
          </form>

          <div style={{ fontSize: 11.5, color: "var(--ink-faint)", marginTop: 18 }}>
            Your mobile number and login code are set up
            <br />
            by your admin.
          </div>
        </div>
      </div>
    </>
  );
}
