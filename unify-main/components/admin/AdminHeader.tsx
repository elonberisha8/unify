"use client";
import * as React from "react";
import { BellIcon, SearchIcon } from "@/components/icons";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/Avatar";
import { Input } from "../ui/Input";

export interface AdminHeaderProps {
  title: string;
  description?: string;
  user?: { name: string; avatarUrl?: string; role?: string };
  onSearch?: (q: string) => void;
  notificationCount?: number;
  onNotificationsClick?: () => void;
  actions?: React.ReactNode;
  className?: string;
}

export function AdminHeader({ title, description, user, onSearch, notificationCount, onNotificationsClick, actions, className }: AdminHeaderProps) {
  return (
    <header className={cn("flex items-center gap-4 py-4 px-6 border-b border-border bg-white", className)}>
      <div className="flex-1 min-w-0">
        <h1 className="font-display text-2xl text-unify-brown truncate">{title}</h1>
        {description && <p className="text-sm text-muted-foreground truncate">{description}</p>}
      </div>

      {onSearch && (
        <div className="relative w-72 hidden md:block">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Kërko..." className="pl-10" onChange={(e) => onSearch(e.target.value)} />
        </div>
      )}

      {actions}

      {onNotificationsClick && (
        <button onClick={onNotificationsClick} className="relative h-10 w-10 rounded-full hover:bg-muted flex items-center justify-center">
          <BellIcon className="h-4 w-4" />
          {notificationCount != null && notificationCount > 0 && (
            <span className="absolute top-1 right-1 h-4 min-w-4 px-1 rounded-full bg-destructive text-white text-[10px] font-bold flex items-center justify-center">
              {notificationCount > 9 ? "9+" : notificationCount}
            </span>
          )}
        </button>
      )}

      {user && (
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold">{user.name}</p>
            {user.role && <p className="text-xs text-muted-foreground">{user.role}</p>}
          </div>
          <Avatar>
            {user.avatarUrl && <AvatarImage src={user.avatarUrl} />}
            <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
        </div>
      )}
    </header>
  );
}
