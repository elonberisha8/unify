"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { AdminSidebar, type AdminSidebarProps } from "../admin/AdminSidebar";
import { AdminHeader, type AdminHeaderProps } from "../admin/AdminHeader";

export interface AdminLayoutProps {
  children: React.ReactNode;
  sidebar?: AdminSidebarProps;
  header?: AdminHeaderProps;
  className?: string;
}

export function AdminLayout({ children, sidebar, header, className }: AdminLayoutProps) {
  return (
    <div className={cn("min-h-screen bg-background flex", className)}>
      {sidebar && <AdminSidebar {...sidebar} />}
      <div className="flex-1 flex flex-col min-w-0">
        {header && <AdminHeader {...header} />}
        <main className="flex-1 p-6 md:p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
