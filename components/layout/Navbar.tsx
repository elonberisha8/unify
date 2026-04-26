// NOTION: https://www.notion.so/34874891227e8103a6b4cf331028bb95
"use client";
import * as React from "react";
import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { MenuIcon } from "@/components/icons";
import { cn } from "@/lib/utils";
import { Button, Sheet, SheetContent, SheetTrigger } from "@/components/ui";

export interface NavLink {
  label: string;
  href: string;
}

export interface NavbarProps {
  logo?: React.ReactNode;
  links?: NavLink[];
  /** @deprecated — handled internally via Clerk */
  onLogin?: () => void;
  /** @deprecated — handled internally via Clerk */
  onRegister?: () => void;
  onSearch?: () => void;
  /** @deprecated — detected internally via Clerk */
  isAuthenticated?: boolean;
  userMenu?: React.ReactNode;
  className?: string;
}

export function Navbar({
  logo, links = [], onLogin, onRegister, onSearch,
  isAuthenticated: isAuthProp, userMenu, className,
}: NavbarProps) {
  const pathname = usePathname();
  const router   = useRouter();
  const { isSignedIn } = useUser();

  // Clerk-aware: prop fallback → internal Clerk state
  const authenticated = isAuthProp ?? isSignedIn ?? false;
  const handleLogin    = onLogin    ?? (() => router.push("/auth/login"));
  const handleRegister = onRegister ?? (() => router.push("/auth/register"));

  useEffect(() => {
    links.forEach((l) => router.prefetch(l.href));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <header className={cn("sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border", className)}>
      <div className="max-w-7xl mx-auto flex items-center gap-6 px-4 md:px-6 h-16">
        <Link href="/" className="font-display text-2xl text-unify-brown hover:text-unify-blue transition-colors">
          {logo ?? "Unify"}
        </Link>

        {/* Nav links — desktop */}
        <nav className="hidden md:flex items-center gap-1 flex-1">
          {links.map((l) => {
            const active = l.href === "/" ? pathname === "/" : pathname === l.href || pathname.startsWith(l.href + "/");
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "px-3 py-2 text-sm font-bold transition-colors rounded-full",
                  active ? "text-unify-blue bg-blue-50" : "text-unify-brown hover:text-unify-blue"
                )}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        {/* Actions — desktop */}
        <div className="hidden md:flex items-center gap-2 ml-auto">
          {onSearch && (
            <button onClick={onSearch} aria-label="Kërko" className="h-10 w-10 rounded-full hover:bg-muted flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </button>
          )}
          {authenticated ? (
            userMenu ?? (
              <Button variant="outline" onClick={() => router.push("/dashboard")}>
                Dashboard
              </Button>
            )
          ) : (
            <>
              <Button variant="ghost" onClick={handleLogin}>Hyr</Button>
              <Button onClick={handleRegister}>Regjistrohu</Button>
            </>
          )}
        </div>

        {/* Mobile menu */}
        <Sheet>
          <SheetTrigger asChild>
            <button className="md:hidden ml-auto h-10 w-10 rounded-full hover:bg-muted flex items-center justify-center" aria-label="Menu">
              <MenuIcon className="h-5 w-5" />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px]">
            <nav className="flex flex-col gap-1 mt-6">
              {links.map((l) => (
                <Link key={l.href} href={l.href} className="px-3 py-3 text-base font-bold text-unify-brown hover:bg-muted rounded-xl">
                  {l.label}
                </Link>
              ))}
              <div className="mt-4 flex flex-col gap-2">
                {authenticated ? (
                  <Button onClick={() => router.push("/dashboard")} className="w-full">
                    Dashboard
                  </Button>
                ) : (
                  <>
                    <Button variant="outline" onClick={handleLogin} className="w-full">Hyr</Button>
                    <Button onClick={handleRegister} className="w-full">Regjistrohu</Button>
                  </>
                )}
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
