"use client"

// ============================================================
// BRANCH: feat/auth
// FIGMA:
//   • Login → https://www.figma.com/design/1OT7I2MkWFD2ClFkMGkQt7/Unify-Platform-Design?node-id=35-2
// NOTION: https://www.notion.so/34874891227e810bb074e9e50dab305f
// ============================================================

import { LoginForm } from "@/components/auth"
import { AuthLayout } from "@/components/layout"

export default function LoginPage() {
  return (
    <AuthLayout
      imageUrl="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1600"
      title="Mirë se u ktheve në Unify"
      description="Platforma e parë për crowdfunding dhe ndihmë vullnetare për të gjithë shqiptarët."
    >
      <LoginForm
        onSubmit={async () => { window.location.href = "/dashboard" }}
        onGoogleLogin={() => { window.location.href = "/sso-callback" }}
        onForgotPassword={() => { window.location.href = "/auth/forgot-password" }}
        onRegister={() => { window.location.href = "/auth/register" }}
      />
    </AuthLayout>
  )
}
