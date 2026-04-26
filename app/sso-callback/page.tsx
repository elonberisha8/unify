"use client"

import { useEffect } from "react"
import { useClerk, useSignUp, useSignIn } from "@clerk/nextjs"
import { useRouter } from "next/navigation"

export default function SSOCallbackPage() {
  const { handleRedirectCallback } = useClerk()
  const { signUp } = useSignUp()
  const { signIn } = useSignIn()
  const router = useRouter()

  useEffect(() => {
    async function handle() {
      try {
        await handleRedirectCallback({
          afterSignInUrl: "/dashboard",
          afterSignUpUrl: "/onboarding",
          // Nëse sign-up ka fusha që mungojnë (p.sh. username), kalo direkt
          continueSignUpUrl: "/onboarding",
        })
      } catch {
        // Nëse callback dështon, kontrollo gjendjen e signUp/signIn
        if (signUp?.status === "missing_requirements") {
          // Plotëso sign-up pa fusha shtesë
          try {
            const result = await signUp.update({})
            if (result.status === "complete") {
              router.push("/onboarding")
            } else {
              router.push("/onboarding")
            }
          } catch {
            router.push("/onboarding")
          }
        } else if (signIn?.status === "complete") {
          router.push("/dashboard")
        } else {
          router.push("/auth/login?error=sso")
        }
      }
    }
    handle()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center space-y-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-unify-blue border-t-transparent mx-auto" />
        <p className="text-muted-foreground">Duke u identifikuar me Google...</p>
      </div>
    </div>
  )
}
