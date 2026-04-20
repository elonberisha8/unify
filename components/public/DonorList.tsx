import * as React from "react";
import { cn } from "@/lib/utils";

export interface Donor {
  name: string;
  amount: string;
  avatar?: string;
  message?: string;
  date?: string;
  anonymous?: boolean;
}

export interface DonorListProps {
  donors: Donor[];
  title?: string;
  className?: string;
}

export function DonorList({ donors, title = "Donatorët", className }: DonorListProps) {
  return (
    <div className={cn("bg-card rounded-[24px] p-6 border border-border", className)}>
      <h3 className="font-display text-lg text-unify-brown mb-4">{title}</h3>
      <ul className="divide-y divide-border">
        {donors.map((d, i) => (
          <li key={i} className="flex gap-3 py-3">
            <div className="h-10 w-10 rounded-full bg-muted overflow-hidden flex-shrink-0">
              {d.avatar && !d.anonymous && <img src={d.avatar} alt="" className="h-full w-full object-cover" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between gap-2">
                <p className="font-sans text-sm font-medium text-unify-brown truncate">
                  {d.anonymous ? "Anonim" : d.name}
                </p>
                <p className="font-sans text-sm font-bold text-unify-blue">{d.amount}</p>
              </div>
              {d.message && <p className="font-sans text-sm text-muted-foreground mt-1">{d.message}</p>}
              {d.date && <p className="font-sans text-xs text-muted-foreground mt-1">{d.date}</p>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
