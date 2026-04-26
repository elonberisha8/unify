"use client";

/**
 * useAuthGuard — Hook i unifikuar për autentikim në frontend.
 *
 * Pranon Clerk session OSE localStorage authToken (demo).
 * NUK redirekton derisa Clerk-u të jetë plotësisht ngarkuar — kjo shmang
 * redirect-in e gabuar gjatë navigimit kur Clerk po ringarkon sesionin.
 */

import * as React from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

interface AuthGuardOptions {
  redirectTo?: string;       // Default: /auth/login
  currentPath?: string;       // Path për ?redirect= kthim mbas login
  enabled?: boolean;          // Default: true
}

export interface AuthGuardResult {
  ready: boolean;             // Clerk loaded AND auth state determined
  authenticated: boolean;
  hasSession: boolean;        // True nëse ka token (Clerk ose localStorage)
  getToken: () => Promise<string | null>;
}

export function useAuthGuard(options: AuthGuardOptions = {}): AuthGuardResult {
  const { redirectTo = "/auth/login", currentPath, enabled = true } = options;
  const router = useRouter();
  const { isLoaded, isSignedIn, getToken } = useAuth();

  const [hasLocalToken, setHasLocalToken] = React.useState<boolean | null>(null);

  // Read localStorage on mount
  React.useEffect(() => {
    if (typeof window === "undefined") {
      setHasLocalToken(false);
      return;
    }
    try {
      const token = window.localStorage.getItem("authToken");
      setHasLocalToken(Boolean(token));
    } catch {
      setHasLocalToken(false);
    }
  }, []);

  // Ready = Clerk loaded AND we've checked localStorage
  const ready = isLoaded && hasLocalToken !== null;
  const authenticated = Boolean(isSignedIn || hasLocalToken);
  const hasSession = authenticated;

  // Redirect ONLY when truly ready and NOT authenticated
  React.useEffect(() => {
    if (!enabled) return;
    if (!ready) return;
    if (authenticated) return;
    const path = currentPath ?? (typeof window !== "undefined" ? window.location.pathname : "");
    const url = path ? `${redirectTo}?redirect=${encodeURIComponent(path)}` : redirectTo;
    router.replace(url);
  }, [enabled, ready, authenticated, redirectTo, currentPath, router]);

  // Wrapped getToken: prefer Clerk; fallback to localStorage demo token
  const getTokenSafe = React.useCallback(async () => {
    if (isSignedIn) {
      try {
        const t = await getToken();
        if (t) return t;
      } catch {}
    }
    if (typeof window !== "undefined") {
      return window.localStorage.getItem("authToken");
    }
    return null;
  }, [getToken, isSignedIn]);

  return {
    ready,
    authenticated,
    hasSession,
    getToken: getTokenSafe,
  };
}
