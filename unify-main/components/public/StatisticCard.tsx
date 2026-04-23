import * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "../ui/Card";

export interface StatisticCardProps {
  value: string | number;
  label: string;
  icon?: React.ReactNode;
  trend?: string;
  variant?: "default" | "inverse" | "accent";
  className?: string;
}

export function StatisticCard({ value, label, icon, trend, variant = "default", className }: StatisticCardProps) {
  const bg = variant === "inverse" ? "bg-unify-brown text-white" : variant === "accent" ? "bg-unify-blue text-white" : "bg-white";
  return (
    <Card className={cn(bg, className)}>
      <CardContent className="p-6">
        {icon && <div className="mb-3 text-unify-blue">{icon}</div>}
        <div className="font-display text-3xl md:text-4xl">{value}</div>
        <div className={cn("text-sm mt-1", variant === "default" ? "text-muted-foreground" : "opacity-80")}>{label}</div>
        {trend && <div className="text-xs mt-2 font-bold text-unify-green">{trend}</div>}
      </CardContent>
    </Card>
  );
}
