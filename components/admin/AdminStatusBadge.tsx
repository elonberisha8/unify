import * as React from "react";
import { cn } from "@/lib/utils";
import { Badge, type BadgeProps } from "@/components/ui";

export type AdminStatus =
  | "active" | "inactive" | "pending" | "verified" | "unverified"
  | "suspended" | "banned" | "approved" | "rejected" | "under-review"
  | "flagged" | "resolved";

const MAP: Record<AdminStatus, { label: string; variant: BadgeProps["variant"] }> = {
  "active": { label: "Aktive", variant: "success" },
  "inactive": { label: "Joaktive", variant: "secondary" },
  "pending": { label: "Në pritje", variant: "warning" },
  "verified": { label: "I verifikuar", variant: "success" },
  "unverified": { label: "I paverifikuar", variant: "secondary" },
  "suspended": { label: "Pezulluar", variant: "warning" },
  "banned": { label: "I bllokuar", variant: "destructive" },
  "approved": { label: "Miratuar", variant: "success" },
  "rejected": { label: "Refuzuar", variant: "destructive" },
  "under-review": { label: "Në shqyrtim", variant: "warning" },
  "flagged": { label: "Raportuar", variant: "destructive" },
  "resolved": { label: "Zgjidhur", variant: "success" },
};

export interface AdminStatusBadgeProps {
  status: AdminStatus;
  className?: string;
}

export function AdminStatusBadge({ status, className }: AdminStatusBadgeProps) {
  const { label, variant } = MAP[status];
  return <Badge variant={variant} className={cn(className)}>{label}</Badge>;
}
