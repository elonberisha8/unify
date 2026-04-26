"use client"

import * as React from "react"
import { useAuth, useUser } from "@clerk/nextjs"
import { apiFetch } from "@/app/_lib/api"

export function UserSync() {
  const { isLoaded: authLoaded, isSignedIn, getToken } = useAuth()
  const { isLoaded: userLoaded, user } = useUser()
  const lastSyncedUserId = React.useRef<string | null>(null)

  React.useEffect(() => {
    if (!authLoaded || !userLoaded || !isSignedIn || !user) return
    const currentUser = user
    if (lastSyncedUserId.current === currentUser.id) return

    let cancelled = false

    async function syncUser() {
      try {
        const token = await getToken()
        if (!token || cancelled) return

        await apiFetch("/users/sync", {
          method: "POST",
          token,
          body: JSON.stringify({
            name: currentUser.fullName || currentUser.firstName || "Anetar",
            email: currentUser.primaryEmailAddress?.emailAddress || "",
            image: currentUser.imageUrl || null,
            username: currentUser.username || undefined,
          }),
        })

        if (!cancelled) {
          lastSyncedUserId.current = currentUser.id
        }
      } catch (err) {
        console.error("User sync failed:", err)
      }
    }

    syncUser()

    return () => {
      cancelled = true
    }
  }, [authLoaded, getToken, isSignedIn, user, userLoaded])

  return null
}
