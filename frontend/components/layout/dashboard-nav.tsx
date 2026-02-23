"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, MessageSquare, Hash, TrendingUp } from "lucide-react";

const nav = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/mentions", label: "Mentions", icon: MessageSquare },
  { href: "/dashboard/keywords", label: "Keywords", icon: Hash },
  { href: "/dashboard/timeline", label: "Timeline", icon: TrendingUp },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
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
              <Icon className="w-5 h-5 shrink-0" />
              {label}
            </div>
          </Link>
        );
      })}
    </nav>
  );
}
