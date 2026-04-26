// NOTION: https://www.notion.so/34874891227e8103a6b4cf331028bb95
"use client";
import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MenuIcon, SearchIcon } from "@/components/icons";
import { cn } from "@/lib/utils";
import { Button, Sheet, SheetContent, SheetTrigger } from "@/components/ui";

export interface NavLink {
  label: string;
  href: string;
}

export interface NavbarProps {
  logo?: React.ReactNode;
  links?: NavLink[];
  onLogin?: () => void;
  onRegister?: () => void;
  onSearch?: () => void;
  isAuthenticated?: boolean;
  userMenu?: React.ReactNode;
  className?: string;
}

export function Navbar({
  logo, links = [], onLogin, onRegister, onSearch,
  isAuthenticated, userMenu, className,
}: NavbarProps) {
  const pathname = usePathname();

  return (
    <header className={cn("sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border", className)}>
      <div className="max-w-7xl mx-auto flex items-center gap-6 px-4 md:px-6 h-16">
        <Link href="/" className="font-display text-2xl text-unify-brown hover:text-unify-blue transition-colors">
          {logo ?? "Unify"}
        </Link>

        <nav className="hidden md:flex items-center gap-1 flex-1">
          {links.map((l) => {
            const active = l.href === "/" ? pathname === "/" : pathname === l.href || pathname.startsWith(l.href + "/");
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "px-3 py-2 text-sm font-bold transition-colors rounded-full",
                  active ? "text-unify-blue bg-blue-50" : "text-unify-brown hover:text-unify-blue"
                )}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-2 ml-auto">
          {onSearch && (
            <button onClick={onSearch} aria-label="Kërko" className="h-10 w-10 rounded-full hover:bg-muted flex items-center justify-center">
              <SearchIcon className="h-4 w-4" />
            </button>
          )}
          {isAuthenticated ? userMenu : (
            <>
              {onLogin && <Button variant="ghost" onClick={onLogin}>Hyr</Button>}
              {onRegister && <Button onClick={onRegister}>Regjistrohu</Button>}
            </>
          )}
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <button className="md:hidden ml-auto h-10 w-10 rounded-full hover:bg-muted flex items-center justify-center" aria-label="MenuIcon">
              <MenuIcon className="h-5 w-5" />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px]">
            <nav className="flex flex-col gap-1 mt-6">
              {links.map((l) => (
                <Link key={l.href} href={l.href} className="px-3 py-3 text-base font-bold text-unify-brown hover:bg-muted rounded-xl">
                  {l.label}
                </Link>
              ))}
              <div className="mt-4 flex flex-col gap-2">
                {onLogin && <Button variant="outline" onClick={onLogin} className="w-full">Hyr</Button>}
                {onRegister && <Button onClick={onRegister} className="w-full">Regjistrohu</Button>}
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
