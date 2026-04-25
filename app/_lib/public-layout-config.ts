// ============================================================
// BRANCH: feat/static-pages
// Internal — shared PublicLayout config (nav links + footer).
// Used by all public pages on this branch to avoid duplication.
// ============================================================

import type { NavbarProps } from "@/components/layout"

export const PUBLIC_NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Kampanjat", href: "/kampanjat" },
  { label: "Vullnetare", href: "/vullnetare" },
  { label: "Shpalljet", href: "/shpalljet" },
  { label: "Si Funksionon", href: "/sherbimet" },
  { label: "Rreth Nesh", href: "/rreth-nesh" },
  { label: "Blog", href: "/blog" },
]

export const PUBLIC_NAVBAR: NavbarProps = {
  links: PUBLIC_NAV_LINKS,
}

export const PUBLIC_FOOTER = {
  className: "bg-unify-blue text-white",
  tagline:
    "Platforma e parë për crowdfunding dhe ndihmë vullnetare për të gjithë shqiptarët.",
  sections: [
    {
      title: "Platforma",
      links: [
        { label: "Si Funksionon", href: "/sherbimet" },
        { label: "Rreth Nesh", href: "/rreth-nesh" },
        { label: "Blog", href: "/blog" },
      ],
    },
    {
      title: "Ligjore",
      links: [
        { label: "Kushtet", href: "/kushtet" },
        { label: "Privatësia", href: "/privatesia" },
      ],
    },
    {
      title: "Kontakt",
      links: [{ label: "Na Shkruaj", href: "/kontakt" }],
    },
  ],
  socials: [
    { platform: "facebook" as const, href: "#" },
    { platform: "instagram" as const, href: "#" },
  ],
  copyright: `© ${new Date().getFullYear()} Unify. Të gjitha të drejtat e rezervuara.`,
}
