"use client";
import * as React from "react";
import { MoreHorizontalIcon } from "@/components/icons";
import { cn } from "@/lib/utils";
import { formatNumber } from "@/lib/format";
import { Card, CardContent } from "../ui/Card";
import { Progress } from "../ui/Progress";
import { Badge } from "../ui/Badge";

export interface CampaignGoalCardProps {
  title: string;
  status?: "active" | "draft" | "completed" | "paused";
  raised: number;
  goal: number;
  currency?: string;
  daysLeft?: number;
  donorCount?: number;
  onMenuClick?: () => void;
  className?: string;
}

const STATUS_MAP = {
  active: { label: "Aktive", variant: "success" as const },
  draft: { label: "Draft", variant: "secondary" as const },
  completed: { label: "Përfunduar", variant: "primary" as const },
  paused: { label: "Pauzuar", variant: "warning" as const },
};

export function CampaignGoalCard({
  title, status = "active", raised, goal, currency = "€",
  daysLeft, donorCount, onMenuClick, className,
}: CampaignGoalCardProps) {
  const pct = Math.min(100, Math.round((raised / goal) * 100));
  const s = STATUS_MAP[status];
  return (
    <Card className={cn(className)}>
      <CardContent className="p-5 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <Badge variant={s.variant} className="mb-2">{s.label}</Badge>
            <h3 className="font-display text-lg text-unify-brown line-clamp-1">{title}</h3>
          </div>
          {onMenuClick && (
            <button onClick={onMenuClick} className="h-8 w-8 rounded-full hover:bg-muted flex items-center justify-center">
              <MoreHorizontalIcon className="h-4 w-4" />
            </button>
          )}
        </div>
        <Progress value={pct} />
        <div className="flex items-center justify-between text-sm">
          <span className="font-bold text-unify-brown">{currency}{formatNumber(raised)}</span>
          <span className="text-muted-foreground">{pct}% nga {currency}{formatNumber(goal)}</span>
        </div>
        {(donorCount != null || daysLeft != null) && (
          <div className="flex gap-4 pt-2 border-t border-border text-xs text-muted-foreground">
            {donorCount != null && <span><span className="font-bold text-foreground">{donorCount}</span> donatorë</span>}
            {daysLeft != null && <span><span className="font-bold text-foreground">{daysLeft}</span> ditë mbetur</span>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
