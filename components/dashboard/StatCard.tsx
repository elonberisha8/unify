import * as React from "react";
import { TrendingUpIcon, TrendingDownIcon } from "@/components/icons";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "../ui/Card";

export interface StatCardProps {
  label: string;
  value: string | number;
  change?: { value: string; direction: "up" | "down" | "neutral" };
  icon?: React.ReactNode;
  className?: string;
}

export function StatCard({ label, value, change, icon, className }: StatCardProps) {
  return (
    <Card className={cn(className)}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</p>
            <p className="font-display text-3xl text-unify-brown mt-2">{value}</p>
          </div>
          {icon && <div className="h-10 w-10 rounded-full bg-unify-cream flex items-center justify-center text-unify-blue">{icon}</div>}
        </div>
        {change && (
          <div className={cn("mt-3 flex items-center gap-1 text-xs font-bold",
            change.direction === "up" ? "text-unify-green" : change.direction === "down" ? "text-destructive" : "text-muted-foreground"
          )}>
            {change.direction === "up" && <TrendingUpIcon className="h-3 w-3" />}
            {change.direction === "down" && <TrendingDownIcon className="h-3 w-3" />}
            {change.value}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
