import * as React from "react";
import { cn } from "@/lib/utils";
import { HandHeartIcon, MegaphoneIcon, TrendingUpIcon, UsersIcon } from "@/components/icons";

export interface AuthLayoutProps {
  children: React.ReactNode;
  imageUrl?: string;
  title?: string;
  description?: string;
  variant?: "login" | "register" | "forgot";
  className?: string;
}

const stats = [
  { label: "Dhurues", value: "1,240+", icon: <UsersIcon className="h-5 w-5" /> },
  { label: "Kampanja", value: "89", icon: <MegaphoneIcon className="h-5 w-5" /> },
  { label: "Mbledhur", value: "€124K", icon: <TrendingUpIcon className="h-5 w-5" /> },
];

export function AuthLayout({
  children,
  imageUrl,
  title = "Unite, Ignite,\nMake it Right",
  description = "Platforma e parë shqiptare e crowdfunding dhe ndihmës vullnetare.",
  variant = "login",
  className,
}: AuthLayoutProps) {
  const showStats = variant === "login";

  return (
    <div className={cn("min-h-screen grid bg-[#faf7f2] lg:grid-cols-[560px_1fr]", className)}>
      <aside className="relative hidden overflow-hidden bg-gradient-to-br from-unify-blue to-blue-800 text-white lg:block">
        {imageUrl && <img src={imageUrl} alt="" className="absolute inset-0 h-full w-full object-cover opacity-20" />}
        <div
          className={cn(
            "absolute rounded-full bg-white/5",
            showStats ? "bottom-[-180px] right-[-100px] h-[400px] w-[400px]" : "bottom-[-110px] left-[-125px] h-[500px] w-[500px]"
          )}
        />
        <div className="relative z-10 flex h-full min-h-screen flex-col justify-center px-16">
          <HandHeartIcon className="mb-8 h-10 w-10 text-white/80" />
          <h1 className="whitespace-pre-line font-display text-5xl leading-tight">{title}</h1>
          <p className="mt-6 max-w-md text-base leading-6 text-blue-100">{description}</p>

          {showStats && (
            <div className="absolute bottom-16 left-16 right-16 grid grid-cols-3 gap-8">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <div className="flex items-center gap-2 text-white">
                    {stat.icon}
                    <span className="font-display text-3xl">{stat.value}</span>
                  </div>
                  <p className="mt-2 text-sm text-blue-100">{stat.label}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </aside>

      <main className="flex min-h-screen items-center justify-center px-5 py-10 md:px-10">
        {children}
      </main>
    </div>
  );
}
