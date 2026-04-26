import * as React from "react";
import { FacebookIcon, InstagramIcon, TwitterIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

export interface FooterProps {
  logo?: React.ReactNode;
  tagline?: string;
  sections?: { title: string; links: { label: string; href: string }[] }[];
  socials?: { platform: "facebook" | "instagram" | "twitter"; href: string }[];
  copyright?: string;
  className?: string;
}

const SOCIAL_ICONS = {
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  twitter: TwitterIcon,
};

const defaultSections = [
  {
    title: "Menu",
    links: [
      { label: "Rreth Nesh", href: "#about" },
      { label: "Shpalijet", href: "#causes" },
      { label: "Shërbimet", href: "#services" },
      { label: "Ngjarjet", href: "#stories" },
    ],
  },
  {
    title: "Ligjore",
    links: [
      { label: "Kushtet e Përdorimit", href: "#features" },
      { label: "Politika e Privatësisë", href: "#features" },
      { label: "info@unify.ks", href: "mailto:info@unify.ks" },
      { label: "Kontakt", href: "#contact" },
    ],
  },
];

const defaultSocials: NonNullable<FooterProps["socials"]> = [
  { platform: "twitter", href: "#" },
  { platform: "instagram", href: "#" },
  { platform: "facebook", href: "#" },
];

export function Footer({
  logo,
  sections = defaultSections,
  socials = defaultSocials,
  copyright,
  className,
}: FooterProps) {
  return (
    <footer className={cn("bg-[#1899f2] text-white", className)}>
      <div className="mx-auto grid w-full max-w-[1180px] gap-12 px-8 py-14 md:grid-cols-[1.2fr_1fr_1fr_auto] md:items-start lg:px-10">
        <div>
          <a
            href="/"
            className="font-[family:var(--font-display)] text-[44px] font-extrabold leading-none text-white"
          >
            {logo ?? "Unify"}
          </a>
        </div>

        {sections.map((section) => (
          <div key={section.title}>
            <h3 className="mb-6 text-[11px] font-extrabold uppercase tracking-[0.28em] text-white">
              {section.title}
            </h3>
            <ul className="space-y-4">
              {section.links.map((link) => (
                <li key={`${section.title}-${link.label}`}>
                  <a href={link.href} className="text-[13px] font-medium text-white/92 transition-opacity hover:opacity-80">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="flex items-center gap-3 md:justify-end">
          {socials.map((social) => {
            const Icon = SOCIAL_ICONS[social.platform];

            return (
              <a
                key={social.platform}
                href={social.href}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#56bf64] text-white transition-transform hover:-translate-y-0.5"
                aria-label={social.platform}
              >
                <Icon className="h-4 w-4" />
              </a>
            );
          })}
        </div>
      </div>

      <div className="border-t border-white/20">
        <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-4 px-8 py-6 text-[11px] text-white/65 md:flex-row md:items-center md:justify-between lg:px-10">
          <p>{copyright ?? "Të drejtat e autorit © 2026 Unify, të gjitha të drejtat e rezervuara."}</p>
          <div className="flex items-center gap-8">
            <a href="#features" className="transition-opacity hover:opacity-80">
              Kushtet e Përdorimit
            </a>
            <a href="#features" className="transition-opacity hover:opacity-80">
              Politika e Privatësisë
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
