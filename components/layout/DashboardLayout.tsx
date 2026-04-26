"use client";

import * as React from "react";
import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboardIcon, MegaphoneIcon, HandHeartIcon, InboxIcon, BookmarkIcon, SettingsIcon, WalletIcon, ScrollTextIcon, UserIcon, LogOutIcon, BellIcon, FileIcon } from "@/components/icons";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/Avatar";
import { apiFetch, type DashboardNotification } from "@/app/_lib/api";

export interface DashboardNavItem {
  key: string;
  label: string;
  icon: React.ReactNode;
  href?: string;
  badge?: string | number;
}

export const DEFAULT_DASHBOARD_NAV: DashboardNavItem[] = [
  { key: "home", label: "Dashboard", icon: <LayoutDashboardIcon className="h-4 w-4" />, href: "/dashboard" },
  { key: "kampanjat", label: "Kampanjat", icon: <MegaphoneIcon className="h-4 w-4" />, href: "/dashboard/kampanjat" },
  { key: "shpalljet", label: "Shpalljet", icon: <HandHeartIcon className="h-4 w-4" />, href: "/dashboard/shpalljet" },
  { key: "inbox", label: "Inbox", icon: <InboxIcon className="h-4 w-4" />, href: "/dashboard/inbox" },
  { key: "te-ruajtura", label: "Te ruajtura", icon: <BookmarkIcon className="h-4 w-4" />, href: "/dashboard/te-ruajtura" },
  { key: "transaksionet", label: "Transaksionet", icon: <WalletIcon className="h-4 w-4" />, href: "/dashboard/transaksionet" },
  { key: "aplikimet", label: "Aplikimet", icon: <ScrollTextIcon className="h-4 w-4" />, href: "/dashboard/aplikimet" },
  { key: "profili", label: "Profili", icon: <UserIcon className="h-4 w-4" />, href: "/dashboard/profili" },
  { key: "aktiviteti", label: "Aktiviteti", icon: <SettingsIcon className="h-4 w-4" />, href: "/dashboard/aktiviteti" },
  { key: "blog", label: "Blog", icon: <FileIcon className="h-4 w-4" />, href: "/dashboard/blog" },
];

export interface DashboardLayoutProps {
  children: React.ReactNode;
  navItems?: DashboardNavItem[];
  activeKey?: string;
  onSelect?: (key: string) => void;
  user?: { name: string; email?: string; avatarUrl?: string };
  onLogout?: () => void;
  className?: string;
}

export function DashboardLayout({
  children, navItems = DEFAULT_DASHBOARD_NAV, activeKey, onSelect,
  user, onLogout, className,
}: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<DashboardNotification[]>([]);

  React.useEffect(() => {
    async function loadNotifications() {
      if (!isLoaded) return;
      const hasLocalToken = typeof window !== "undefined" && Boolean(window.localStorage.getItem("authToken"));
      if (!isSignedIn && !hasLocalToken) return;
      try {
        const token = isSignedIn ? await getToken() : null;
        const data = await apiFetch<{ notifications: DashboardNotification[] }>("/notifications", { token });
        setNotifications(data.notifications.map((notification) => ({
          ...notification,
          time: new Date(notification.createdAt).toLocaleString("sq-AL"),
        })));
      } catch {
        setNotifications([]);
      }
    }
    loadNotifications();
  }, [getToken, isLoaded, isSignedIn]);

  const unreadCount = notifications.filter((n) => !n.readAt).length;

  async function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, readAt: n.readAt ?? new Date().toISOString() })));
    try {
      const token = isSignedIn ? await getToken() : null;
      await apiFetch("/notifications/read-all", { method: "PATCH", token });
    } catch {
      // Keep optimistic state when local auth/backend is unavailable.
    }
  }

  function isActive(item: DashboardNavItem) {
    if (activeKey) return activeKey === item.key;
    if (item.href) return pathname === item.href;
    return false;
  }

  return (
    <div className={cn("min-h-screen bg-background flex", className)}>
      {notifOpen && <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />}

      <aside className="w-64 shrink-0 bg-white border-r border-border flex flex-col">
        <div className="p-5 border-b border-border">
          <p className="font-display text-2xl text-unify-brown">Unify</p>
        </div>
        <nav className="flex-1 p-3 flex flex-col gap-1 overflow-y-auto">
          {navItems.map((it) => {
            const active = isActive(it);
            const baseClass = cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-left transition-colors",
              active ? "bg-unify-blue text-white" : "text-unify-brown hover:bg-muted"
            );
            const inner = (
              <>
                {it.icon}
                <span className="flex-1">{it.label}</span>
                {it.badge != null && (
                  <span className={cn("text-xs px-2 py-0.5 rounded-full",
                    active ? "bg-white text-unify-blue" : "bg-unify-blue text-white"
                  )}>{it.badge}</span>
                )}
              </>
            );
            if (it.href) {
              return (
                <Link
                  key={it.key}
                  href={it.href}
                  prefetch
                  onClick={() => onSelect?.(it.key)}
                  className={baseClass}
                >
                  {inner}
                </Link>
              );
            }
            return (
              <button
                key={it.key}
                onClick={() => onSelect?.(it.key)}
                className={baseClass}
              >
                {inner}
              </button>
            );
          })}
        </nav>

        {user && (
          <div className="p-3 border-t border-border">
            <div className="flex items-center gap-3 p-2">
              <Avatar>
                {user.avatarUrl && <AvatarImage src={user.avatarUrl} />}
                <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate">{user.name}</p>
                {user.email && <p className="text-xs text-muted-foreground truncate">{user.email}</p>}
              </div>
              {onLogout && (
                <button onClick={onLogout} className="h-8 w-8 rounded-full hover:bg-muted flex items-center justify-center" aria-label="Dil">
                  <LogOutIcon className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 shrink-0 bg-white border-b border-border flex items-center justify-end px-6 gap-3">
          <div className="relative">
            <button
              onClick={() => setNotifOpen((o) => !o)}
              className="relative w-9 h-9 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
              aria-label="Njoftime"
            >
              <BellIcon className="h-5 w-5 text-unify-brown" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-unify-blue text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 top-12 w-80 bg-white border border-border rounded-2xl shadow-xl z-50 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                  <span className="text-sm font-semibold text-gray-900">Njoftime</span>
                  {unreadCount > 0 && (
                    <button onClick={markAllRead} className="text-xs text-unify-blue hover:underline">
                      Sheno si te lexuara
                    </button>
                  )}
                </div>
                <div className="divide-y divide-border max-h-72 overflow-y-auto">
                  {notifications.length === 0 && (
                    <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                      Nuk ka njoftime ne databaze.
                    </div>
                  )}
                  {notifications.map((n) => (
                    <div key={n.id} className={cn("px-4 py-3 text-sm cursor-default", !n.readAt && "bg-unify-blue/5")}>
                      <div className="flex items-start gap-2.5">
                        <span className={cn("mt-1.5 w-2 h-2 rounded-full flex-shrink-0", !n.readAt ? "bg-unify-blue" : "bg-transparent")} />
                        <div>
                          <p className="text-gray-700 leading-snug text-[13px]">{n.title}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{n.message}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{n.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2.5 border-t border-border text-center">
                  <button
                    onClick={() => { router.push("/dashboard/aktiviteti"); setNotifOpen(false); }}
                    className="text-xs text-unify-blue hover:underline"
                  >
                    Shiko te gjitha aktivitetet
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 p-6 md:p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
