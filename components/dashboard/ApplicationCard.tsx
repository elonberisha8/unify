import * as React from "react";
import { CalendarIcon, MapPinIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

export interface ApplicationCardProps {
  title: string;
  organization: string;
  status: "pending" | "accepted" | "rejected";
  location?: string;
  date?: string;
  avatar?: string;
  onClick?: () => void;
  className?: string;
}

const statusLabels = { pending: "Në pritje", accepted: "E pranuar", rejected: "E refuzuar" };
const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  accepted: "bg-unify-green/10 text-unify-green",
  rejected: "bg-destructive/10 text-destructive",
};

export function ApplicationCard({ title, organization, status, location, date, avatar, onClick, className }: ApplicationCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn("bg-card rounded-[20px] p-5 border border-border hover:shadow-md transition-shadow cursor-pointer", className)}
    >
      <div className="flex justify-between items-start gap-4">
        <div className="flex gap-4 min-w-0 flex-1">
          {avatar && <img src={avatar} alt="" className="h-12 w-12 rounded-full object-cover" />}
          <div className="min-w-0">
            <h3 className="font-display text-lg text-unify-brown truncate">{title}</h3>
            <p className="font-sans text-sm text-muted-foreground truncate">{organization}</p>
          </div>
        </div>
        <span className={cn("px-3 py-1 rounded-full text-xs font-sans font-bold flex-shrink-0", statusColors[status])}>
          {statusLabels[status]}
        </span>
      </div>
      {(location || date) && (
        <div className="flex gap-4 mt-3 pt-3 border-t border-border font-sans text-xs text-muted-foreground">
          {location && <span className="flex items-center gap-1"><MapPinIcon className="h-3 w-3" />{location}</span>}
          {date && <span className="flex items-center gap-1"><CalendarIcon className="h-3 w-3" />{date}</span>}
        </div>
      )}
    </div>
  );
}
