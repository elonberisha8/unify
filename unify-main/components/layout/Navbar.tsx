"use client";

import * as React from "react";
import { ChevronDownIcon, MenuIcon, SearchIcon, UserIcon } from "@/components/icons";
import { Button, Sheet, SheetContent, SheetTrigger } from "@/components/ui";
import { cn } from "@/lib/utils";

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
  logo,
  links = [],
  onLogin,
  onRegister,
  onSearch,
  isAuthenticated,
  userMenu,
  className,
}: NavbarProps) {
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 12);

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        isScrolled ? "bg-[#fbf8f2]/95 shadow-[0_14px_40px_rgba(63,33,13,0.08)] backdrop-blur-md" : "bg-transparent",
        className
      )}
    >
      <div className="mx-auto flex h-24 w-full max-w-[1180px] items-center px-5 sm:px-8 lg:px-10">
        <a
          href="/"
          className="font-[family:var(--font-display)] text-[34px] font-extrabold leading-none text-[#3f210d]"
        >
          {logo ?? "Unify"}
        </a>

        <nav className="ml-8 hidden items-center gap-8 lg:flex">
          {links.map((link, index) => (
            <a
              key={link.href}
              href={link.href}
              className={cn(
                "text-[13px] font-semibold text-[#5a4334] transition-colors hover:text-[#1899f2]",
                index === 0 && "text-[#1899f2]"
              )}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto hidden items-center gap-4 lg:flex">
          <button
            type="button"
            className="flex h-10 items-center gap-2 rounded-full border border-[#e6e1d3] bg-white px-4 text-[11px] font-bold uppercase tracking-[0.12em] text-[#1899f2]"
          >
            Home
            <ChevronDownIcon className="h-3.5 w-3.5" />
          </button>
          <Button
            type="button"
            onClick={onRegister}
            className="h-10 min-w-[108px] rounded-full bg-[#1899f2] px-6 text-[11px] font-extrabold uppercase tracking-[0.08em] text-white hover:bg-[#1290e6]"
          >
            Fillo Tani 
          </Button>
          {isAuthenticated ? (
            userMenu
          ) : (
            <button
              type="button"
              onClick={onLogin}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e6e1d3] bg-transparent text-[#b6af9f] transition-colors hover:border-[#1899f2] hover:text-[#1899f2]"
              aria-label="User menu"
            >
              <UserIcon className="h-4 w-4" />
            </button>
          )}
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <button
              type="button"
              className="ml-auto flex h-11 w-11 items-center justify-center rounded-full border border-[#e6e1d3] bg-white text-[#3f210d] lg:hidden"
              aria-label="Open navigation"
            >
              <MenuIcon className="h-5 w-5" />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[310px] border-l-0 bg-[#fbf8f2] px-6 py-8">
            <div className="flex flex-col gap-6 pt-10">
              <a
                href="/"
                className="font-[family:var(--font-display)] text-[32px] font-extrabold text-[#3f210d]"
              >
                {logo ?? "Unify"}
              </a>
              <nav className="flex flex-col gap-2">
                {links.map((link, index) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "rounded-full px-4 py-3 text-sm font-semibold text-[#5a4334]",
                      index === 0 ? "bg-white text-[#1899f2]" : "hover:bg-white"
                    )}
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
              <div className="flex items-center gap-3">
                {onSearch && (
                  <button
                    type="button"
                    onClick={onSearch}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-[#e6e1d3] bg-white text-[#3f210d]"
                    aria-label="Search"
                  >
                    <SearchIcon className="h-4 w-4" />
                  </button>
                )}
                <Button
                  type="button"
                  onClick={onRegister}
                  className="h-11 flex-1 rounded-full bg-[#1899f2] text-[11px] font-extrabold uppercase tracking-[0.08em] text-white hover:bg-[#1290e6]"
                >
                  Fille Tani
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
