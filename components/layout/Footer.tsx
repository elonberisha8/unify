import * as React from "react";
import { FacebookIcon, InstagramIcon, TwitterIcon, LinkedinIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

export interface FooterProps {
  logo?: React.ReactNode;
  tagline?: string;
  sections?: { title: string; links: { label: string; href: string }[] }[];
  socials?: { platform: "facebook" | "instagram" | "twitter" | "linkedin"; href: string }[];
  copyright?: string;
  className?: string;
}

const SOCIAL_ICONS = { facebook: FacebookIcon, instagram: InstagramIcon, twitter: TwitterIcon, linkedin: LinkedinIcon };

export function Footer({ logo, tagline, sections = [], socials = [], copyright, className }: FooterProps) {
  return (
    <footer className={cn("bg-unify-brown text-white", className)}>
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="font-display text-3xl">{logo ?? "Unify"}</div>
          {tagline && <p className="text-sm opacity-80 mt-3 max-w-xs">{tagline}</p>}
          {socials.length > 0 && (
            <div className="flex gap-2 mt-5">
              {socials.map((s) => {
                const Icon = SOCIAL_ICONS[s.platform];
                return (
                  <a key={s.platform} href={s.href} target="_blank" rel="noopener noreferrer"
                    className="h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center" aria-label={s.platform}>
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          )}
        </div>

        {sections.map((sec) => (
          <div key={sec.title}>
            <h3 className="font-bold text-sm uppercase tracking-wider mb-4 opacity-90">{sec.title}</h3>
            <ul className="space-y-2">
              {sec.links.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-sm opacity-80 hover:opacity-100 hover:text-unify-blue transition-colors">{l.label}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 text-xs opacity-70">
          {copyright ?? `© ${new Date().getFullYear()} Unify. Të gjitha të drejtat të rezervuara.`}
        </div>
      </div>
    </footer>
  );
}
