import * as React from "react";
import { MoreHorizontalIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "user" | "creator" | "admin";
  status: "active" | "suspended" | "pending";
  joined: string;
}

export interface UserTableProps {
  users: AdminUser[];
  onAction?: (id: string) => void;
  className?: string;
}

const roleLabel = { user: "Përdorues", creator: "Krijues", admin: "Admin" };
const statusCfg = {
  active: { label: "Aktiv", color: "bg-unify-green/10 text-unify-green" },
  suspended: { label: "I pezulluar", color: "bg-destructive/10 text-destructive" },
  pending: { label: "Në pritje", color: "bg-yellow-100 text-yellow-800" },
};

export function UserTable({ users, onAction, className }: UserTableProps) {
  return (
    <div className={cn("bg-card rounded-[20px] border border-border overflow-hidden", className)}>
      <table className="w-full">
        <thead className="bg-muted/50">
          <tr>
            {["Përdoruesi", "Roli", "Statusi", "U bashkua", ""].map((h, i) => (
              <th key={i} className="text-left font-sans text-xs font-bold uppercase tracking-wide text-muted-foreground px-5 py-3">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-t border-border hover:bg-muted/30">
              <td className="px-5 py-3">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-muted overflow-hidden flex-shrink-0">
                    {u.avatar && <img src={u.avatar} alt="" className="h-full w-full object-cover" />}
                  </div>
                  <div>
                    <p className="font-sans text-sm font-medium text-unify-brown">{u.name}</p>
                    <p className="font-sans text-xs text-muted-foreground">{u.email}</p>
                  </div>
                </div>
              </td>
              <td className="px-5 py-3 font-sans text-sm text-unify-brown">{roleLabel[u.role]}</td>
              <td className="px-5 py-3">
                <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-sans font-bold", statusCfg[u.status].color)}>
                  {statusCfg[u.status].label}
                </span>
              </td>
              <td className="px-5 py-3 font-sans text-sm text-muted-foreground whitespace-nowrap">{u.joined}</td>
              <td className="px-5 py-3 text-right">
                <button
                  onClick={() => onAction?.(u.id)}
                  className="h-8 w-8 rounded-full hover:bg-muted flex items-center justify-center"
                  aria-label="Veprime"
                >
                  <MoreHorizontalIcon className="h-4 w-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
