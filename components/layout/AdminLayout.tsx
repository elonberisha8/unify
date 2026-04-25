"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { AdminHeader, AdminSidebar, type AdminHeaderProps, type AdminSidebarProps } from "@/components/admin";

export interface AdminLayoutProps {
  children: React.ReactNode;
  sidebar?: AdminSidebarProps;
  header?: AdminHeaderProps;
  className?: string;
}

export function AdminLayout({ children, sidebar, header, className }: AdminLayoutProps) {
  return (
    <div className={cn("flex min-h-screen flex-col bg-unify-cream/40 lg:flex-row", className)}>
      {sidebar && <AdminSidebar {...sidebar} />}
      <div className="flex-1 flex flex-col min-w-0">
        {header && <AdminHeader {...header} />}
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
