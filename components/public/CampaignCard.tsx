"use client";
import * as React from "react";
import { HeartIcon, MapPinIcon, CalendarIcon, ShareIcon, BookmarkIcon } from "@/components/icons";
import { cn } from "@/lib/utils";
import { formatNumber } from "@/lib/format";
import { Badge, Button, Card, CardContent, Progress } from "@/components/ui";

export interface CampaignCardProps {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  category?: string;
  location?: string;
  raised: number;
  goal: number;
  currency?: string;
  daysLeft?: number;
  donorCount?: number;
  creatorName?: string;
  verified?: boolean;
  bookmarked?: boolean;
  onBookmark?: () => void;
  onShare?: () => void;
  onDonate?: () => void;
  onClick?: () => void;
  className?: string;
}

export function CampaignCard({
  title, description, imageUrl, category, location, raised, goal,
  currency = "€", daysLeft, donorCount, creatorName, verified,
  bookmarked, onBookmark, onShare, onDonate, onClick, className,
}: CampaignCardProps) {
  const pct = Math.min(100, Math.round((raised / goal) * 100));
  const fmt = (n: number) => formatNumber(n);

  return (
    <Card className={cn("overflow-hidden group hover:shadow-lg transition-shadow", className)}>
      <div
        onClick={onClick}
        onKeyDown={(e) => {
          if (onClick && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            onClick();
          }
        }}
        role={onClick ? "button" : undefined}
        tabIndex={onClick ? 0 : undefined}
        className="relative w-full aspect-[4/3] overflow-hidden bg-muted block cursor-pointer"
      >
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full bg-unify-cream" />
        )}
        {category && <Badge variant="primary" className="absolute top-3 left-3">{category}</Badge>}
        <div className="absolute top-3 right-3 flex gap-2">
          {onBookmark && (
            <button onClick={(e) => { e.stopPropagation(); onBookmark(); }} className="h-9 w-9 rounded-full bg-white/90 flex items-center justify-center hover:bg-white">
              <BookmarkIcon className={cn("h-4 w-4", bookmarked && "fill-unify-blue text-unify-blue")} />
            </button>
          )}
          {onShare && (
            <button onClick={(e) => { e.stopPropagation(); onShare(); }} className="h-9 w-9 rounded-full bg-white/90 flex items-center justify-center hover:bg-white">
              <ShareIcon className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <CardContent className="p-5 space-y-3">
        <button onClick={onClick} className="text-left w-full">
          <h3 className="font-display text-lg text-unify-brown line-clamp-2 group-hover:text-unify-blue transition-colors">
            {title}
          </h3>
        </button>
        {description && <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>}

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          {location && <span className="flex items-center gap-1"><MapPinIcon className="h-3 w-3" />{location}</span>}
          {daysLeft != null && <span className="flex items-center gap-1"><CalendarIcon className="h-3 w-3" />{daysLeft} ditë</span>}
        </div>

        <div className="space-y-1.5">
          <Progress value={pct} />
          <div className="flex justify-between text-sm">
            <span className="font-bold text-unify-brown">{currency}{fmt(raised)}</span>
            <span className="text-muted-foreground">nga {currency}{fmt(goal)}</span>
          </div>
        </div>

        {(creatorName || donorCount != null) && (
          <div className="flex items-center justify-between pt-2 border-t border-border text-xs">
            {creatorName && (
              <span className="flex items-center gap-1 text-muted-foreground">
                nga <span className="font-bold text-foreground">{creatorName}</span>
                {verified && <span className="text-unify-blue">✓</span>}
              </span>
            )}
            {donorCount != null && <span className="text-muted-foreground">{donorCount} donatorë</span>}
          </div>
        )}

        {onDonate && (
          <Button onClick={onDonate} className="w-full" size="md">
            <HeartIcon className="h-4 w-4" /> Dhuro
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
