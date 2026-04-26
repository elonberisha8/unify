// NOTION: https://www.notion.so/34874891227e8103a6b4cf331028bb95
"use client";
import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { MenuIcon, SearchIcon } from "@/components/icons";
import { cn } from "@/lib/utils";
import { Button, Sheet, SheetContent, SheetTrigger } from "@/components/ui";

export interface NavLink {
  label: string;
  href: string;
}

export interface NavbarProps {
  logo?: React.ReactNode;
  links?: NavLink[];
  onLogin?: () => void;
  onRegister?: () => void;
  onSearch?: () => void;
  isAuthenticated?: boolean;
  userMenu?: React.ReactNode;
  className?: string;
}

function ClerkAuthProbe() {
  // Lazy: only used inside ClerkProvider tree. We try-catch to be safe.
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { useAuth } = require("@clerk/nextjs");
    return useAuth();
  } catch {
    return { isLoaded: true, isSignedIn: false };
  }
}

function ClerkSignOut() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { useClerk } = require("@clerk/nextjs");
    return useClerk();
  } catch {
    return { signOut: async () => {} };
  }
}

export function Navbar({
  logo, links = [], onLogin, onRegister, onSearch,
  isAuthenticated, userMenu, className,
}: NavbarProps) {
  const pathname = usePathname();
  const { isLoaded: clerkLoaded, isSignedIn: clerkSignedIn } = ClerkAuthProbe();

  const readLocalAuth = React.useCallback(() => {
    if (typeof window === "undefined") return false;
    return ["jwt", "token", "authToken"].some((key) => {
      try {
        return Boolean(window.localStorage.getItem(key) || window.sessionStorage.getItem(key));
      } catch {
        return false;
      }
    });
  }, []);

  const [localAuth, setLocalAuth] = React.useState(false);
  const [authReady, setAuthReady] = React.useState(isAuthenticated !== undefined);

  // Effective auth: explicit prop > Clerk > localStorage fallback
  const effectiveAuthenticated = isAuthenticated ?? (clerkSignedIn || localAuth);
  const router = useRouter();
  const clerk = ClerkSignOut();
  const goToLogin = onLogin ?? (() => { router.push("/auth/login"); });
  const goToRegister = onRegister ?? (() => { router.push("/auth/register"); });
  const goToDashboard = () => { router.push("/dashboard"); };

  const handleLogoutDefault = async () => {
    try {
      if (clerkSignedIn) await clerk.signOut();
    } catch { /* ignore */ }
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("authToken");
      window.localStorage.removeItem("unifyUsername");
      window.dispatchEvent(new Event("unify-auth-change"));
    }
    router.replace("/");
  };

  React.useEffect(() => {
    if (isAuthenticated !== undefined) {
      setAuthReady(true);
      return;
    }

    const syncAuthState = () => {
      setLocalAuth(readLocalAuth());
    };

    syncAuthState();
    if (clerkLoaded) setAuthReady(true);

    window.addEventListener("storage", syncAuthState);
    window.addEventListener("focus", syncAuthState);
    window.addEventListener("pageshow", syncAuthState);
    window.addEventListener("unify-auth-change", syncAuthState);

    return () => {
      window.removeEventListener("storage", syncAuthState);
      window.removeEventListener("focus", syncAuthState);
      window.removeEventListener("pageshow", syncAuthState);
      window.removeEventListener("unify-auth-change", syncAuthState);
    };
  }, [isAuthenticated, readLocalAuth, clerkLoaded]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className={cn("sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border", className)}>
      <div className="max-w-7xl mx-auto flex items-center gap-6 px-4 md:px-6 h-16">
        <Link
          href="/"
          className="font-display text-2xl text-unify-brown transition-colors hover:text-unify-blue"
          aria-label="Unify - Kryefaqja"
        >
          {logo ?? "Unify"}
        </Link>

        <nav className="hidden md:flex items-center gap-1 flex-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "px-3 py-2 text-sm font-bold transition-colors rounded-full",
                isActive(l.href)
                  ? "bg-unify-blue text-white shadow-sm"
                  : "text-unify-brown hover:text-unify-blue hover:bg-unify-blue/5"
              )}
              aria-current={isActive(l.href) ? "page" : undefined}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2 ml-auto">
          {onSearch && (
            <button onClick={onSearch} aria-label="Kërko" className="h-10 w-10 rounded-full hover:bg-muted flex items-center justify-center">
              <SearchIcon className="h-4 w-4" />
            </button>
          )}
          {!authReady ? (
            <div className="h-11 w-[196px]" aria-hidden="true" />
          ) : effectiveAuthenticated ? (
            userMenu ?? (
              <>
                <Button variant="ghost" onClick={goToDashboard}>Dashboard</Button>
                <Button variant="outline" onClick={handleLogoutDefault} aria-label="Dil">
                  Dil
                </Button>
              </>
            )
          ) : (
            <>
              <Button variant="ghost" onClick={goToLogin}>Hyr</Button>
              <Button onClick={goToRegister}>Regjistrohu</Button>
            </>
          )}
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <button className="md:hidden ml-auto h-10 w-10 rounded-full hover:bg-muted flex items-center justify-center" aria-label="MenuIcon">
              <MenuIcon className="h-5 w-5" />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px]">
            <nav className="flex flex-col gap-1 mt-6">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={cn(
                    "px-3 py-3 text-base font-bold rounded-xl transition-colors",
                    isActive(l.href)
                      ? "bg-unify-blue text-white"
                      : "text-unify-brown hover:bg-muted"
                  )}
                  aria-current={isActive(l.href) ? "page" : undefined}
                >
                  {l.label}
                </Link>
              ))}
              <div className="mt-4 flex flex-col gap-2">
                {!authReady ? (
                  <div className="h-24" aria-hidden="true" />
                ) : effectiveAuthenticated ? (
                  <Button onClick={goToDashboard} className="w-full">Dashboard</Button>
                ) : (
                  <>
                    <Button variant="outline" onClick={goToLogin} className="w-full">Hyr</Button>
                    <Button onClick={goToRegister} className="w-full">Regjistrohu</Button>
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
