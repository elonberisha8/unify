"use client";

// ============================================================
// BRANCH: feat/auth
// FIGMA:
//   • Forgot Password → https://www.figma.com/design/1OT7I2MkWFD2ClFkMGkQt7/Unify-Platform-Design?node-id=37-2
// NOTION: https://www.notion.so/34874891227e810bb074e9e50dab305f
// ============================================================

import * as React from "react";
import { useRouter } from "next/navigation";
import { ForgotPasswordForm } from "@/components/auth";
import { AuthLayout } from "@/components/layout";

export default function ForgotPasswordPage() {
  const router = useRouter();

  async function handleSubmit(email: string) {
    await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
  }

  return (
    <AuthLayout
      title="Kthe fjalëkalimin"
      description="Shkruaj email-in tënd dhe do të të dërgojmë udhëzime"
    >
      <ForgotPasswordForm
        onSubmit={handleSubmit}
        onBackToLogin={() => router.push("/auth/login")}
      />
    </AuthLayout>
  );
}
