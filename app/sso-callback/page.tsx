"use client"

import { useEffect } from "react"
import { useClerk } from "@clerk/nextjs"

export default function SSOCallbackPage() {
  const { handleRedirectCallback } = useClerk()

  useEffect(() => {
    handleRedirectCallback({
      afterSignInUrl: "/dashboard",
      afterSignUpUrl: "/onboarding",
    })
  }, [handleRedirectCallback])

  return (
    <div className="flex h-screen items-center justify-center">
      <p className="text-muted-foreground">Duke u identifikuar...</p>
    </div>
  )
}
