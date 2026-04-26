"use client"

import { AuthenticateWithRedirectCallback } from "@clerk/nextjs"

export default function SSOCallbackPage() {
  return (
    <div className="flex h-screen items-center justify-center">
      <p className="text-muted-foreground">Duke u identifikuar...</p>
      <AuthenticateWithRedirectCallback
        afterSignInUrl="/dashboard"
        afterSignUpUrl="/onboarding"
      />
    </div>
  )
}
