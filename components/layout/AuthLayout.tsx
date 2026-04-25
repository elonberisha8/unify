import * as React from "react";
import { cn } from "@/lib/utils";

export interface AuthLayoutProps {
  children: React.ReactNode;
  variant?: "login" | "register";
  className?: string;
  // kept for backward compat (unused)
  title?: string;
  description?: string;
  imageUrl?: string;
}

export function AuthLayout({ children, variant = "login", className }: AuthLayoutProps) {
  const isLogin = variant === "login";

  return (
    <div className={cn("min-h-screen bg-[#faf7f2] flex flex-col lg:grid lg:grid-cols-[560px_1fr]", className)}>

      {/* ── LEFT — blue gradient panel ─────────────────────── */}
      <div
        className="hidden lg:flex flex-col justify-between relative overflow-hidden"
        style={{ background: "linear-gradient(127.5deg, #009eff 0%, #1e3fa8 100%)" }}
      >
        {/* decorative circle */}
        <div className="absolute rounded-full bg-white/5"
          style={isLogin
            ? { width: 400, height: 400, left: 260, top: 429 }
            : { width: 500, height: 500, left: -125, top: 354 }}
        />

        {/* main text */}
        <div className="relative px-16 pt-20 flex-1 flex flex-col justify-center">
          <p className="font-display font-light text-white leading-tight"
            style={{ fontSize: 48, lineHeight: "60px" }}>
            {isLogin
              ? <><span>Unite, Ignite,</span><br /><span>Make it Right</span></>
              : <><span>Bashkohu me</span><br /><span>mijëra shqiptarë</span><br /><span>që ndihmojnë!</span></>}
          </p>
          <p className="mt-6 text-[#bedbff] text-base leading-relaxed">
            {isLogin
              ? <><span>Platforma e parë shqiptare</span><br /><span>e crowdfunding dhe ndihmës vullnetare.</span></>
              : <><span>Krijo llogarinë tënde falas dhe</span><br /><span>fillo të bësh ndryshim sot.</span></>}
          </p>
        </div>

        {/* stats (login only) */}
        {isLogin && (
          <div className="relative px-16 pb-16 flex gap-10">
            {[
              { icon: "👥", value: "1,240+", label: "Dhurues" },
              { icon: "📢", value: "89",     label: "Kampanja" },
              { icon: "📈", value: "€124K",  label: "Mbledhur" },
            ].map((s) => (
              <div key={s.label}>
                <div className="flex items-center gap-2">
                  <span className="text-lg">{s.icon}</span>
                  <span className="font-display font-light text-white text-3xl">{s.value}</span>
                </div>
                <p className="text-[#bedbff] text-sm mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── RIGHT — cream form panel ───────────────────────── */}
      <div className="flex items-center justify-center p-8 bg-[#faf7f2]">
        <div className="w-full max-w-[448px]">
          {children}
        </div>
      </div>
    </div>
  );
}
