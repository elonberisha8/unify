"use client";
import * as React from "react";
import { MapPinIcon, ClockIcon, UsersIcon } from "@/components/icons";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";

export interface VolunteerCardProps {
  title: string;
  organization?: string;
  imageUrl?: string;
  category?: string;
  location?: string;
  hoursPerWeek?: string;
  startDate?: string;
  applicantCount?: number;
  skills?: string[];
  onApply?: () => void;
  onClick?: () => void;
  className?: string;
}

export function VolunteerCard({
  title, organization, imageUrl, category, location, hoursPerWeek,
  startDate, applicantCount, skills, onApply, onClick, className,
}: VolunteerCardProps) {
  return (
    <Card className={cn("overflow-hidden group hover:shadow-lg transition-shadow", className)}>
      <button onClick={onClick} className="relative w-full aspect-video overflow-hidden bg-muted block">
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full bg-unify-cream" />
        )}
        {category && <Badge variant="secondary" className="absolute top-3 left-3">{category}</Badge>}
      </button>

      <CardContent className="p-5 space-y-3">
        <button onClick={onClick} className="text-left w-full">
          <h3 className="font-display text-lg text-unify-brown line-clamp-2 group-hover:text-unify-blue transition-colors">
            {title}
          </h3>
          {organization && <p className="text-sm text-muted-foreground mt-1">{organization}</p>}
        </button>

        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
          {location && <span className="flex items-center gap-1"><MapPinIcon className="h-3 w-3" />{location}</span>}
          {hoursPerWeek && <span className="flex items-center gap-1"><ClockIcon className="h-3 w-3" />{hoursPerWeek}</span>}
          {applicantCount != null && <span className="flex items-center gap-1"><UsersIcon className="h-3 w-3" />{applicantCount} aplikantë</span>}
        </div>

        {skills && skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {skills.slice(0, 3).map((s) => <Badge key={s} variant="outline">{s}</Badge>)}
          </div>
        )}

        {startDate && <p className="text-xs text-muted-foreground">Fillon: <span className="font-bold text-foreground">{startDate}</span></p>}

        {onApply && <Button onClick={onApply} className="w-full">Apliko</Button>}
      </CardContent>
    </Card>
  );
}
