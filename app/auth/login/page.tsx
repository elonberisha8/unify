"use client";

// ============================================================
// BRANCH: feat/auth
// FIGMA:
//   • Login → https://www.figma.com/design/1OT7I2MkWFD2ClFkMGkQt7/Unify-Platform-Design?node-id=35-2
// NOTION: https://www.notion.so/34874891227e810bb074e9e50dab305f
// ============================================================

import * as React from "react";
import { useRouter } from "next/navigation";
import { LoginForm } from "@/components/auth";
import { AuthLayout } from "@/components/layout";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = React.useState<string | undefined>();

  async function handleSubmit(data: { email: string; password: string }) {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.message ?? "Email ose fjalëkalimi i gabuar.");
        return;
      }
      router.push("/dashboard");
    } catch {
      setError("Ndodhi një gabim. Provo përsëri.");
    }
  }

  return (
    <AuthLayout variant="login">
      <LoginForm
        onSubmit={handleSubmit}
        onGoogleLogin={() => router.push("/api/auth/google")}
        onForgotPassword={() => router.push("/auth/forgot-password")}
        onRegister={() => router.push("/auth/register")}
        error={error}
      />
    </AuthLayout>
  );
}
