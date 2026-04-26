"use client";
import * as React from "react";

// ── Icon helpers ─────────────────────────────────────────────
function IconEmail() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-gray-400">
      <path d="M2.5 5.5A1.5 1.5 0 0 1 4 4h12a1.5 1.5 0 0 1 1.5 1.5v9A1.5 1.5 0 0 1 16 16H4a1.5 1.5 0 0 1-1.5-1.5v-9Z" stroke="currentColor" strokeWidth="1.5"/>
      <path d="m2.5 5.5 7.5 5.5 7.5-5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}
function IconLock() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-gray-400">
      <rect x="3.5" y="9" width="13" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M6.5 9V6.5a3.5 3.5 0 0 1 7 0V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}
function IconGoogle() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

export interface LoginFormProps {
  onSubmit?: (data: { email: string; password: string; remember: boolean }) => void | Promise<void>;
  onGoogleLogin?: () => void;
  onForgotPassword?: () => void;
  onRegister?: () => void;
  error?: string;
  className?: string;
}

export function LoginForm({ onSubmit, onGoogleLogin, onForgotPassword, onRegister, error }: LoginFormProps) {
  const [email, setEmail]       = React.useState("");
  const [password, setPassword] = React.useState("");
  const [remember, setRemember] = React.useState(false);
  const [loading, setLoading]   = React.useState(false);

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try { await onSubmit?.({ email, password, remember }); } finally { setLoading(false); }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Heading */}
      <div>
        <h1 className="font-display font-light text-[#101828]" style={{ fontSize: 36, lineHeight: "40px" }}>
          Mirë se vini sërish!
        </h1>
        <p className="text-[#4a5565] text-base mt-3">Kyçuni në llogarinë tuaj të Unify.</p>
      </div>

      <div className="flex flex-col gap-6">
        {/* Google */}
        {onGoogleLogin && (
          <button
            type="button"
            onClick={onGoogleLogin}
            className="flex items-center justify-center gap-3 w-full bg-white border border-gray-200 rounded-[14px] h-[54px] text-[#101828] font-semibold text-base shadow-sm hover:bg-gray-50 transition-colors"
          >
            <IconGoogle />
            Vazhdo me Google
          </button>
        )}

        {/* Divider */}
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-[#6a7282] text-sm">ose</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Form */}
        <form onSubmit={handle} className="flex flex-col gap-5">
          {/* Email */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-[#364153]">Email Adresa</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <IconEmail />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="emri@shembull.com"
                className="w-full h-[54px] bg-[#f9fafb] border border-gray-200 rounded-[14px] pl-12 pr-4 text-base text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-unify-blue focus:ring-2 focus:ring-unify-blue/20 transition"
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-[#364153]">Fjalëkalimi</label>
              {onForgotPassword && (
                <button type="button" onClick={onForgotPassword}
                  className="text-sm text-unify-blue hover:underline font-medium">
                  Harruat fjalëkalimin?
                </button>
              )}
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <IconLock />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-[54px] bg-[#f9fafb] border border-gray-200 rounded-[14px] pl-12 pr-4 text-base text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-unify-blue focus:ring-2 focus:ring-unify-blue/20 transition"
              />
            </div>
          </div>

          {/* Remember */}
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="w-4 h-4 rounded accent-unify-blue"
            />
            <span className="text-sm text-gray-600">Më mba mend</span>
          </label>

          {/* Error */}
          {error && <p className="text-sm text-red-500">{error}</p>}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-[60px] rounded-[14px] font-display text-lg text-white disabled:opacity-70 transition-opacity"
            style={{
              background: "linear-gradient(90deg, #009eff 0%, #1e40af 100%)",
              boxShadow: "0 10px 15px rgba(43,127,255,0.2), 0 4px 6px rgba(43,127,255,0.2)",
            }}
          >
            {loading ? "Duke hyrë..." : "Kyçu"}
          </button>
        </form>

        {/* Register link */}
        {onRegister && (
          <p className="text-base text-[#4a5565] text-center">
            Nuk keni llogari?{" "}
            <button onClick={onRegister} className="text-unify-blue font-semibold hover:underline">
              Regjistrohu falas →
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
