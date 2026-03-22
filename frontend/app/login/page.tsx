"use client";

import { useEffect, useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { loginWithGoogle, setToken, getToken, type AuthUser } from "@/lib/api";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // If already logged in — redirect
  useEffect(() => {
    if (getToken()) {
      const back = sessionStorage.getItem("login_redirect") ?? "/";
      sessionStorage.removeItem("login_redirect");
      history.replaceState(null, "", back);
      window.dispatchEvent(new PopStateEvent("popstate"));
    }
  }, []);

  async function handleSuccess(credential: string) {
    setLoading(true);
    setError("");
    try {
      const data = await loginWithGoogle(credential);
      setToken(data.token);
      // Store user in sessionStorage so main app picks it up
      sessionStorage.setItem("ilearn_user", JSON.stringify({
        name: data.name, email: data.email, picture: data.picture,
      }));
      const back = sessionStorage.getItem("login_redirect") ?? "/";
      sessionStorage.removeItem("login_redirect");
      window.location.href = back;
    } catch {
      setError("Помилка входу. Спробуй ще раз.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0d0d1f] text-white flex flex-col items-center justify-center px-4 relative overflow-hidden">

      {/* Ambient blobs */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-purple-900/25 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-900/20 rounded-full blur-[110px] pointer-events-none" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🦉</div>
          <h1 className="text-3xl font-black tracking-tight">iLearn</h1>
          <p className="text-white/40 text-sm mt-1">Вивчай мови граючись</p>
        </div>

        {/* Login box */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6 backdrop-blur-sm">
          <div className="text-center space-y-1">
            <h2 className="text-xl font-black">Ласкаво просимо</h2>
            <p className="text-white/40 text-sm">Увійди щоб зберігати прогрес і змагатися в рейтингу</p>
          </div>

          {/* Benefits */}
          <div className="space-y-2">
            {[
              { icon: "📈", text: "Зберігай прогрес між пристроями" },
              { icon: "🏆", text: "Потрапляй в таблицю лідерів" },
              { icon: "🔥", text: "Відстежуй серію та XP" },
            ].map((b, i) => (
              <div key={i} className="flex items-center gap-3 text-sm text-white/60">
                <span className="text-base">{b.icon}</span>
                <span>{b.text}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-white/10" />

          {/* Google button */}
          <div className="flex flex-col items-center gap-3">
            {loading ? (
              <div className="flex items-center gap-2 text-white/40 text-sm">
                <div className="w-4 h-4 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
                Входимо...
              </div>
            ) : (
              <GoogleLogin
                onSuccess={r => r.credential && handleSuccess(r.credential)}
                onError={() => setError("Помилка входу. Спробуй ще раз.")}
                theme="filled_black"
                shape="pill"
                size="large"
                text="signin_with"
              />
            )}
            {error && <p className="text-red-400 text-xs text-center">{error}</p>}
          </div>

          <p className="text-white/20 text-[10px] text-center leading-relaxed">
            Продовжуючи, ти погоджуєшся з умовами використання сервісу
          </p>
        </div>

        {/* Back link */}
        <button
          onClick={() => history.back()}
          className="mt-6 w-full text-white/30 text-sm text-center hover:text-white/60 transition-colors"
        >
          ← Продовжити без входу
        </button>
      </div>
    </div>
  );
}
