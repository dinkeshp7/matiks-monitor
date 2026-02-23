"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  MessageSquare,
  Hash,
  TrendingUp,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { clearToken, isAuthenticated } from "@/lib/auth";

const nav = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/mentions", label: "Mentions", icon: MessageSquare },
  { href: "/dashboard/keywords", label: "Keywords", icon: Hash },
  { href: "/dashboard/timeline", label: "Timeline", icon: TrendingUp },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined" && !isAuthenticated()) {
      router.replace("/login");
    }
  }, [router]);

  function handleLogout() {
    clearToken();
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-background bg-grid-pattern bg-grid flex flex-col md:flex-row">
      <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-white/10 flex flex-col shrink-0">
        <div className="p-6 border-b border-white/10">
          <Link href="/dashboard">
            <span className="text-xl font-bold text-accent">
              Matiks Monitor
            </span>
          </Link>
        </div>
        <nav className="flex-1 p-4 flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-visible">
          {nav.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link key={href} href={href}>
                <div
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors whitespace-nowrap ${
                    active
                      ? "bg-accent/20 text-accent"
                      : "text-white/70 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {label}
                </div>
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-white/10 flex items-center justify-between px-6">
          <div />
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </header>

        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
