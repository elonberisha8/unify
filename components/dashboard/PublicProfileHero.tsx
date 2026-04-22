import * as React from "react";
import { MapPinIcon, CalendarIcon, BadgeCheckIcon } from "@/components/icons";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";

export interface PublicProfileHeroProps {
  name: string;
  avatar?: string;
  cover?: string;
  location?: string;
  joined?: string;
  bio?: string;
  verified?: boolean;
  stats?: { label: string; value: string }[];
  primaryAction?: { label: string; onClick?: () => void };
  className?: string;
}

export function PublicProfileHero({ name, avatar, cover, location, joined, bio, verified, stats = [], primaryAction, className }: PublicProfileHeroProps) {
  return (
    <div className={cn("bg-card rounded-[24px] overflow-hidden border border-border", className)}>
      <div className="h-40 bg-unify-cream relative">
        {cover && <img src={cover} alt="" className="h-full w-full object-cover" />}
      </div>
      <div className="p-6 -mt-12 relative">
        <div className="h-24 w-24 rounded-full border-4 border-card bg-muted overflow-hidden">
          {avatar && <img src={avatar} alt={name} className="h-full w-full object-cover" />}
        </div>
        <div className="mt-4 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-2xl text-unify-brown">{name}</h1>
              {verified && <BadgeCheckIcon className="h-5 w-5 text-unify-blue" />}
            </div>
            <div className="flex flex-wrap gap-4 mt-2 font-sans text-sm text-muted-foreground">
              {location && <span className="flex items-center gap-1"><MapPinIcon className="h-4 w-4" />{location}</span>}
              {joined && <span className="flex items-center gap-1"><CalendarIcon className="h-4 w-4" />U bashkua {joined}</span>}
            </div>
          </div>
          {primaryAction && <Button onClick={primaryAction.onClick}>{primaryAction.label}</Button>}
        </div>
        {bio && <p className="mt-4 font-sans text-sm text-unify-brown leading-relaxed">{bio}</p>}
        {stats.length > 0 && (
          <div className="mt-6 pt-6 border-t border-border grid grid-cols-3 gap-4">
            {stats.map((s, i) => (
              <div key={i} className="text-center">
                <div className="font-display text-2xl text-unify-brown">{s.value}</div>
                <div className="font-sans text-xs text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
