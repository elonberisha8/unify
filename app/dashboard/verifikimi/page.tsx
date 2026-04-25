"use client";

// ============================================================
// BRANCH: feat/dashboard-profile
// FIGMA:
//   • Stripe Identity — Verifikimi → https://www.figma.com/design/1OT7I2MkWFD2ClFkMGkQt7/Unify-Platform-Design?node-id=214-2
// NOTION: https://www.notion.so/34874891227e8188a4d5e1c80adc017a
// ============================================================
//
// Statuset:
//   UNVERIFIED      → Hapi 1: Identity Verification
//   IDENTITY_DONE   → Hapi 2: Connect Onboarding
//   FULLY_VERIFIED  → Verified Creator ✅
//
// URL params: ?success=true, ?refresh=true, ?identity=complete

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { StripeVerificationCard } from "@/components/dashboard";
import { DashboardLayout } from "@/components/layout";

type VerificationStatus = "not-started" | "pending" | "verified" | "failed";

export default function VerifikimiPage() {
  const searchParams = useSearchParams();
  const [status, setStatus] = React.useState<VerificationStatus>("not-started");
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchStatus() {
      try {
        const res = await fetch("/api/verification/status");
        if (res.ok) {
          const data = await res.json();
          if (data.status === "FULLY_VERIFIED") setStatus("verified");
          else if (data.status === "IDENTITY_DONE") setStatus("pending");
          else setStatus("not-started");
        }
      } catch {
        // keep default
      } finally {
        setLoading(false);
      }
    }

    if (searchParams.get("success") === "true") {
      setStatus("verified");
      setLoading(false);
      return;
    }

    fetchStatus();
  }, [searchParams]);

  async function handleStart() {
    const res = await fetch("/api/verification/start", { method: "POST" });
    if (res.ok) {
      const { url } = await res.json();
      window.location.href = url;
    }
  }

  if (loading) {
    return (
      <DashboardLayout activeKey="verifikimi">
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500 text-sm">Duke ngarkuar…</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeKey="verifikimi">
      <div className="space-y-6 max-w-lg">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Verifikimi</h1>
          <p className="text-sm text-gray-500 mt-1">Verifiko identitetin tënd për të krijuar kampanja.</p>
        </div>

        <StripeVerificationCard
          status={status}
          onStart={handleStart}
        />
      </div>
    </DashboardLayout>
  );
}
