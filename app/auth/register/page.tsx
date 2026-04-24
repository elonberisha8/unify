"use client"

// ============================================================
// BRANCH: feat/auth
// FIGMA:
//   • Register → https://www.figma.com/design/1OT7I2MkWFD2ClFkMGkQt7/Unify-Platform-Design?node-id=36-2
// NOTION: https://www.notion.so/34874891227e810bb074e9e50dab305f
// ============================================================

import { RegisterForm } from "@/components/auth"
import { AuthLayout } from "@/components/layout"

export default function RegisterPage() {
  return (
    <AuthLayout
      imageUrl="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1600"
      title="Bashkohu me Unify"
      description="Krijo llogarinë dhe fillo të ndihmosh komunitetin ose të mbledhësh fonde për shkakun tënd."
    >
      <RegisterForm
        onSubmit={async () => { window.location.href = "/onboarding" }}
        onGoogleSignup={() => { window.location.href = "/sso-callback" }}
        onLogin={() => { window.location.href = "/auth/login" }}
      />
    </AuthLayout>
  )
}
