"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth, useUser } from "@clerk/nextjs"
import {
  BookmarkIcon,
  FileTextIcon,
  HandHeartIcon,
  InboxIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  MegaphoneIcon,
  ScrollTextIcon,
  UserIcon,
  WalletIcon,
} from "@/components/icons"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui"
import { cn } from "@/lib/utils"

export interface DashboardNavItem {
  key: string
  label: string
  icon: React.ReactNode
  href?: string
  badge?: string | number
}

export const DEFAULT_DASHBOARD_NAV: DashboardNavItem[] = [
  { key: "home",         label: "Dashboard",     icon: <LayoutDashboardIcon className="h-4 w-4" />, href: "/dashboard" },
  { key: "campaigns",    label: "Kampanjat",     icon: <MegaphoneIcon      className="h-4 w-4" />, href: "/dashboard/kampanjat" },
  { key: "volunteer",    label: "Shpalljet",     icon: <HandHeartIcon      className="h-4 w-4" />, href: "/dashboard/shpalljet" },
  { key: "blog",         label: "Blog",          icon: <FileTextIcon       className="h-4 w-4" />, href: "/dashboard/blog" },
  { key: "inbox",        label: "Inbox",         icon: <InboxIcon          className="h-4 w-4" />, href: "/dashboard/inbox" },
  { key: "bookmarks",    label: "Ruajtura",      icon: <BookmarkIcon       className="h-4 w-4" />, href: "/dashboard/te-ruajtura" },
  { key: "transactions", label: "Transaksionet", icon: <WalletIcon         className="h-4 w-4" />, href: "/dashboard/transaksionet" },
  { key: "applications", label: "Aplikimet",     icon: <ScrollTextIcon     className="h-4 w-4" />, href: "/dashboard/aplikimet" },
  { key: "profile",      label: "Profili",       icon: <UserIcon           className="h-4 w-4" />, href: "/dashboard/profili" },
]

export interface DashboardLayoutProps {
  children: React.ReactNode
  navItems?: DashboardNavItem[]
  activeKey?: string
  onSelect?: (key: string) => void
  /** @deprecated — logout handled internally now */
  onLogout?: () => void
  /** @deprecated — user fetched from Clerk internally now */
  user?: { name: string; email?: string; avatarUrl?: string }
  className?: string
}

export function DashboardLayout({
  children,
  navItems = DEFAULT_DASHBOARD_NAV,
  activeKey,
  onSelect,
  className,
}: DashboardLayoutProps) {
  const router  = useRouter()
  const { signOut } = useAuth()
  const { user } = useUser()
  const [loggingOut, setLoggingOut] = React.useState(false)

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      await signOut({ redirectUrl: "/auth/login" })
    } catch {
      // fallback
      router.push("/auth/login")
    } finally {
      setLoggingOut(false)
    }
  }

  const displayName  = user?.fullName ?? user?.firstName ?? "Përdorues"
  const displayEmail = user?.primaryEmailAddress?.emailAddress ?? ""
  const avatarUrl    = user?.imageUrl ?? ""

  return (
    <div className={cn("flex min-h-screen bg-background", className)}>
      <aside className="flex w-64 shrink-0 flex-col border-r border-border bg-white">
        <div className="border-b border-border p-5">
          <p className="font-display text-2xl text-unify-brown">Unify</p>
        </div>

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
          {navItems.map((item) =>
            item.href ? (
              <Link
                key={item.key}
                href={item.href}
                onClick={() => onSelect?.(item.key)}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition-colors",
                  activeKey === item.key
                    ? "bg-unify-blue text-white"
                    : "text-unify-brown hover:bg-muted"
                )}
              >
                {item.icon}
                <span className="flex-1">{item.label}</span>
                {item.badge != null && (
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-xs",
                      activeKey === item.key
                        ? "bg-white text-unify-blue"
                        : "bg-unify-blue text-white"
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            ) : (
              <button
                key={item.key}
                onClick={() => onSelect?.(item.key)}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-bold transition-colors",
                  activeKey === item.key
                    ? "bg-unify-blue text-white"
                    : "text-unify-brown hover:bg-muted"
                )}
              >
                {item.icon}
                <span className="flex-1">{item.label}</span>
              </button>
            )
          )}
        </nav>

        {/* User + Logout — always visible */}
        <div className="border-t border-border p-3">
          <div className="flex items-center gap-3 p-2">
            <Avatar>
              {avatarUrl && <AvatarImage src={avatarUrl} />}
              <AvatarFallback>{displayName.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-unify-brown">{displayName}</p>
              {displayEmail && (
                <p className="truncate text-xs text-muted-foreground">{displayEmail}</p>
              )}
            </div>
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-50"
              aria-label="Dil nga llogaria"
              title="Dil"
            >
              <LogOutIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <main className="flex-1 overflow-auto p-6 md:p-8">{children}</main>
      </div>
    </div>
  )
}
