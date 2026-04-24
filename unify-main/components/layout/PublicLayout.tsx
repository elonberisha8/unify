import * as React from "react";
import { cn } from "@/lib/utils";
import { Navbar, type NavbarProps } from "./Navbar";
import { Footer, type FooterProps } from "./Footer";

export interface PublicLayoutProps {
  children: React.ReactNode;
  navbar?: NavbarProps;
  footer?: FooterProps;
  className?: string;
  mainClassName?: string;
}

export function PublicLayout({ children, navbar, footer, className, mainClassName }: PublicLayoutProps) {
  return (
    <div className={cn("min-h-screen flex flex-col bg-background", className)}>
      {navbar && <Navbar {...navbar} />}
      <main className={cn("flex-1", mainClassName)}>{children}</main>
      {footer && <Footer {...footer} />}
    </div>
  );
}
