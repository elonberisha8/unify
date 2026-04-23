import * as React from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/Avatar";

export interface ActivityLogItemProps {
  actor?: { name: string; avatarUrl?: string };
  action: string;
  target?: string;
  timestamp: string;
  icon?: React.ReactNode;
  className?: string;
}

export function ActivityLogItem({ actor, action, target, timestamp, icon, className }: ActivityLogItemProps) {
  return (
    <div className={cn("flex items-start gap-3 py-3", className)}>
      {icon ? (
        <div className="h-10 w-10 rounded-full bg-unify-cream flex items-center justify-center text-unify-blue shrink-0">{icon}</div>
      ) : actor ? (
        <Avatar className="shrink-0">
          {actor.avatarUrl && <AvatarImage src={actor.avatarUrl} alt={actor.name} />}
          <AvatarFallback>{actor.name.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
      ) : null}
      <div className="flex-1 min-w-0">
        <p className="text-sm">
          {actor && <span className="font-bold">{actor.name} </span>}
          <span className="text-muted-foreground">{action} </span>
          {target && <span className="font-bold">{target}</span>}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">{timestamp}</p>
      </div>
    </div>
  );
}
