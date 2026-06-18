"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  Calendar,
  LayoutDashboard,
  Scissors,
  Settings,
  Clock,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const nav = [
  { href: "/dashboard", label: "ภาพรวม", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/appointments", label: "คิว", icon: Calendar },
  { href: "/dashboard/services", label: "บริการ", icon: Scissors },
  { href: "/dashboard/schedule", label: "เวลา", icon: Clock },
  { href: "/dashboard/settings", label: "ตั้งค่า", icon: Settings },
];

function isActive(pathname: string, href: string, exact?: boolean) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <Calendar className="h-6 w-6 text-indigo-600" />
            <span className="font-bold">BookFlow</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            {session?.user?.slug && (
              <Link
                href={`/${session.user.slug}`}
                target="_blank"
                className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs text-indigo-600 hover:bg-indigo-50 sm:text-sm sm:hover:underline md:px-0 md:py-0 md:hover:bg-transparent"
              >
                <ExternalLink className="h-4 w-4 shrink-0" />
                <span className="hidden sm:inline">หน้าจองลูกค้า</span>
              </Link>
            )}
            <Button variant="ghost" size="sm" onClick={() => signOut()}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-6 pb-24 md:pb-6">
        <nav className="mb-6 hidden gap-1 overflow-x-auto rounded-xl bg-white p-1 shadow-sm md:flex">
          {nav.map((item) => {
            const active = isActive(pathname, item.href, item.exact);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-medium transition",
                  active
                    ? "bg-indigo-600 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label === "คิว" ? "ตารางคิว" : item.label}
              </Link>
            );
          })}
        </nav>
        {children}
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-gray-200 bg-white/95 backdrop-blur md:hidden">
        <div
          className="mx-auto flex max-w-lg items-stretch justify-around px-1 pt-1"
          style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
        >
          {nav.map((item) => {
            const active = isActive(pathname, item.href, item.exact);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-xl px-1 py-2 text-[10px] font-medium transition active:scale-95",
                  active ? "text-indigo-600" : "text-gray-500"
                )}
              >
                <span
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-xl transition",
                    active ? "bg-indigo-100" : "bg-transparent"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                </span>
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
