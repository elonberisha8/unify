"use client";

/**
 * useBookmark — Hook për bookmark toggle me API
 * Përdor /api/users/bookmark/:campaignId
 */

import * as React from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/app/_lib/api";

export function useBookmark(campaignId: string | null) {
  const { isSignedIn, getToken } = useAuth();
  const router = useRouter();
  const [bookmarked, setBookmarked] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  // Check on mount
  React.useEffect(() => {
    if (!campaignId || !isSignedIn) return;
    let cancelled = false;
    (async () => {
      try {
        const token = await getToken();
        const res = await apiFetch<{ bookmarked: boolean }>(`/users/bookmark/${campaignId}/check`, { token });
        if (!cancelled) setBookmarked(Boolean(res.bookmarked));
      } catch {
        // best-effort
      }
    })();
    return () => { cancelled = true; };
  }, [campaignId, isSignedIn, getToken]);

  const hasLocalAuth = typeof window !== "undefined" && Boolean(window.localStorage.getItem("authToken"));
  const effectivelySignedIn = Boolean(isSignedIn) || hasLocalAuth;

  const toggle = React.useCallback(async () => {
    if (!campaignId) return;
    if (!effectivelySignedIn) {
      router.push(`/auth/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    setLoading(true);
    const next = !bookmarked;
    setBookmarked(next); // optimistic
    try {
      const token = await getToken().catch(() => null);
      await apiFetch(`/users/bookmark/${campaignId}`, { method: "POST", token });
    } catch {
      setBookmarked(!next); // rollback
    } finally {
      setLoading(false);
    }
  }, [campaignId, effectivelySignedIn, bookmarked, getToken, router]);

  return { bookmarked, toggle, loading };
}
