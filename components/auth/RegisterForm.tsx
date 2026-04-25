"use client";
import * as React from "react";

// ── Icon helpers ─────────────────────────────────────────────
function IconPerson() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-gray-400">
      <circle cx="10" cy="6.5" r="3" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M3.5 17c0-3.038 2.91-5.5 6.5-5.5s6.5 2.462 6.5 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}
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

export interface RegisterFormProps {
  onSubmit?: (data: { name: string; email: string; password: string; terms: boolean }) => void | Promise<void>;
  onGoogleSignup?: () => void;
  onLogin?: () => void;
  error?: string;
  className?: string;
}

export function RegisterForm({ onSubmit, onLogin, error }: RegisterFormProps) {
  const [name, setName]           = React.useState("");
  const [email, setEmail]         = React.useState("");
  const [password, setPassword]   = React.useState("");
  const [confirm, setConfirm]     = React.useState("");
  const [terms, setTerms]         = React.useState(false);
  const [loading, setLoading]     = React.useState(false);

  const passwordMismatch = confirm.length > 0 && password !== confirm;

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!terms || passwordMismatch) return;
    setLoading(true);
    try { await onSubmit?.({ name, email, password, terms }); } finally { setLoading(false); }
  };

  const field = (
    label: string,
    icon: React.ReactNode,
    input: React.ReactNode,
    hint?: string,
  ) => (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-[#364153]">{label}</label>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">{icon}</span>
        {input}
      </div>
      {hint && <p className="text-xs text-gray-400">{hint}</p>}
    </div>
  );

  const inputCls = "w-full h-[54px] bg-[#f9fafb] border border-gray-200 rounded-[14px] pl-12 pr-4 text-base text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-unify-blue focus:ring-2 focus:ring-unify-blue/20 transition";

  return (
    <div className="flex flex-col gap-8">
      {/* Heading */}
      <div>
        <h1 className="font-display font-light text-[#101828]" style={{ fontSize: 36, lineHeight: "40px" }}>
          Krijo Llogarinë
        </h1>
        <p className="text-[#4a5565] text-base mt-3">Falas. Pa komision fillestar. Bashkohu tani.</p>
      </div>

      <form onSubmit={handle} className="flex flex-col gap-5">
        {field("Emri i Plotë", <IconPerson />,
          <input type="text" required value={name} onChange={(e) => setName(e.target.value)}
            placeholder="Elona Krasniqi" className={inputCls} />
        )}
        {field("Email Adresa", <IconEmail />,
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="emri@shembull.com" className={inputCls} />
        )}
        {field("Fjalëkalimi", <IconLock />,
          <input type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder="Min. 8 karaktere" className={inputCls} />,
          "Minimumi 8 karaktere"
        )}
        {field("Konfirmo Fjalëkalimin", <IconLock />,
          <input type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)}
            placeholder="Rifut fjalëkalimin"
            className={`${inputCls} ${passwordMismatch ? "border-red-400 focus:ring-red-200" : ""}`} />,
          passwordMismatch ? "⚠️ Fjalëkalimet nuk përputhen" : undefined
        )}

        {/* Terms */}
        <label className="flex items-start gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={terms}
            onChange={(e) => setTerms(e.target.checked)}
            className="mt-0.5 w-4 h-4 rounded accent-unify-blue flex-shrink-0"
          />
          <span className="text-sm text-[#4a5565]">
            Pranoj{" "}
            <a href="/kushtet" className="text-unify-blue hover:underline">Kushtet e Përdorimit</a>
            {" "}dhe{" "}
            <a href="/privatesia" className="text-unify-blue hover:underline">Politikën e Privatësisë</a>
          </span>
        </label>

        {/* Error */}
        {error && <p className="text-sm text-red-500">{error}</p>}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || !terms || passwordMismatch}
          className="w-full h-[60px] rounded-[14px] font-display text-lg text-white disabled:opacity-60 transition-opacity"
          style={{
            background: "linear-gradient(90deg, #009eff 0%, #1e40af 100%)",
            boxShadow: "0 10px 15px rgba(43,127,255,0.2), 0 4px 6px rgba(43,127,255,0.2)",
          }}
        >
          {loading ? "Duke krijuar..." : "Regjistrohu Falas"}
        </button>
      </form>

      {/* Login link */}
      {onLogin && (
        <p className="text-base text-[#4a5565] text-center">
          Keni llogari?{" "}
          <button onClick={onLogin} className="text-unify-blue font-semibold hover:underline">
            Kyçuni →
          </button>
        </p>
      )}
    </div>
  );
}
