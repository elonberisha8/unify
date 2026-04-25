"use client";

// ============================================================
// BRANCH: feat/auth
// FIGMA:
//   • Register → https://www.figma.com/design/1OT7I2MkWFD2ClFkMGkQt7/Unify-Platform-Design?node-id=36-2
// NOTION: https://www.notion.so/34874891227e810bb074e9e50dab305f
// ============================================================

import * as React from "react";
import { useRouter } from "next/navigation";
import { RegisterForm } from "@/components/auth";
import { AuthLayout } from "@/components/layout";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = React.useState<string | undefined>();

  async function handleSubmit(data: { name: string; email: string; password: string }) {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.message ?? "Nuk u krijua llogaria. Provo përsëri.");
        return;
      }
      router.push("/onboarding");
    } catch {
      setError("Ndodhi një gabim. Provo përsëri.");
    }
  }

  return (
    <AuthLayout variant="register">
      <RegisterForm
        onSubmit={handleSubmit}
        onGoogleSignup={() => router.push("/api/auth/google")}
        onLogin={() => router.push("/auth/login")}
        error={error}
      />
    </AuthLayout>
  );
}
