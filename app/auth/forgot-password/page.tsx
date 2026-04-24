"use client"

// ============================================================
// BRANCH: feat/auth
// FIGMA:
//   • Forgot Password → https://www.figma.com/design/1OT7I2MkWFD2ClFkMGkQt7/Unify-Platform-Design?node-id=37-2
// NOTION: https://www.notion.so/34874891227e810bb074e9e50dab305f
// ============================================================

import { ForgotPasswordForm } from "@/components/auth"
import { AuthLayout } from "@/components/layout"

export default function ForgotPasswordPage() {
  return (
    <AuthLayout
      imageUrl="https://images.unsplash.com/photo-1579621970795-87facc2f976d?w=1600"
      title="Rivendos fjalëkalimin"
      description="Do të dërgojmë një link sigurie në email-in tënd për të rivendosur fjalëkalimin."
    >
      <ForgotPasswordForm
        onSubmit={async () => {}}
        onBackToLogin={() => { window.location.href = "/auth/login" }}
      />
    </AuthLayout>
  )
}
