import * as React from "react";
import { cn } from "@/lib/utils";

export type CampaignStatus = "draft" | "review" | "active" | "paused" | "completed" | "rejected";

export interface CampaignStatusCardProps {
  title: string;
  status: CampaignStatus;
  creator: string;
  raised?: string;
  goal?: string;
  createdAt?: string;
  thumbnail?: string;
  onClick?: () => void;
  className?: string;
}

const statusCfg: Record<CampaignStatus, { label: string; color: string }> = {
  draft: { label: "Draft", color: "bg-muted text-muted-foreground" },
  review: { label: "Në rishikim", color: "bg-yellow-100 text-yellow-800" },
  active: { label: "Aktive", color: "bg-unify-green/10 text-unify-green" },
  paused: { label: "E pauzuar", color: "bg-orange-100 text-orange-800" },
  completed: { label: "E përfunduar", color: "bg-unify-blue/10 text-unify-blue" },
  rejected: { label: "E refuzuar", color: "bg-destructive/10 text-destructive" },
};

export function CampaignStatusCard({ title, status, creator, raised, goal, createdAt, thumbnail, onClick, className }: CampaignStatusCardProps) {
  const s = statusCfg[status];
  return (
    <div
      onClick={onClick}
      className={cn("flex gap-4 bg-card rounded-[20px] p-4 border border-border hover:shadow-md transition-shadow cursor-pointer", className)}
    >
      {thumbnail && (
        <img src={thumbnail} alt="" className="h-20 w-20 rounded-xl object-cover flex-shrink-0" />
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-base text-unify-brown truncate">{title}</h3>
          <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-sans font-bold flex-shrink-0", s.color)}>
            {s.label}
          </span>
        </div>
        <p className="font-sans text-xs text-muted-foreground mt-1">nga {creator}</p>
        <div className="flex flex-wrap gap-4 mt-2 font-sans text-xs text-muted-foreground">
          {raised && goal && <span>{raised} / {goal}</span>}
          {createdAt && <span>Krijuar {createdAt}</span>}
        </div>
      </div>
    </div>
  );
}
