"use client";
import * as React from "react";
import { MailIcon, PhoneIcon, MapPinIcon } from "@/components/icons";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "../ui/Card";

export interface ContactCardProps {
  icon?: "mail" | "phone" | "location";
  title: string;
  value: string;
  href?: string;
  className?: string;
}

const ICONS = { mail: MailIcon, phone: PhoneIcon, location: MapPinIcon };

export function ContactCard({ icon = "mail", title, value, href, className }: ContactCardProps) {
  const Icon = ICONS[icon];
  const content = (
    <Card className={cn("hover:shadow-md transition-shadow", className)}>
      <CardContent className="p-6 flex items-start gap-4">
        <div className="h-12 w-12 rounded-full bg-unify-cream flex items-center justify-center shrink-0">
          <Icon className="h-5 w-5 text-unify-blue" />
        </div>
        <div>
          <h3 className="font-bold text-sm text-muted-foreground">{title}</h3>
          <p className="font-display text-lg text-unify-brown mt-0.5">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
  return href ? <a href={href}>{content}</a> : content;
}
