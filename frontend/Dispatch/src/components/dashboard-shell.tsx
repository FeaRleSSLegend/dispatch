import { Link, useRouterState } from "@tanstack/react-router";
import { Activity, BarChart3, FilePlus2, LayoutDashboard, Radio, Shield } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

const navItems = [
  { label: "Overview", to: "/" as const, icon: LayoutDashboard },
  { label: "Incident Queue", to: "/incidents" as const, icon: Activity },
  { label: "New Report", to: "/new-report" as const, icon: FilePlus2 },
  { label: "Analytics", to: "/analytics" as const, icon: BarChart3 },
];

export function DashboardShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 border-r border-border bg-sidebar lg:flex lg:flex-col">
        <div className="flex h-20 items-center gap-3 border-b border-border px-7">
          <span className="flex size-9 items-center justify-center rounded-md border border-primary/30 bg-primary/10 text-primary"><Shield className="size-4" /></span>
          <div><p className="font-display text-base font-semibold tracking-wide">SENTINEL</p><p className="mt-0.5 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Incident command</p></div>
        </div>
        <nav className="flex-1 space-y-1 px-4 py-7" aria-label="Primary navigation">
          {navItems.map((item) => {
            const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
            return <Link key={item.to} to={item.to} className={cn("flex h-11 items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors", active ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground")}><item.icon className={cn("size-4", active && "text-primary")} />{item.label}</Link>;
          })}
        </nav>
        <div className="border-t border-border p-5">
          <div className="flex items-center gap-3"><span className="relative flex size-8 items-center justify-center rounded-full bg-secondary text-xs font-semibold">SO<span className="absolute bottom-0 right-0 size-2 rounded-full bg-success ring-2 ring-sidebar" /></span><div><p className="text-xs font-medium">Security Operations</p><p className="text-[11px] text-muted-foreground">All systems operational</p></div></div>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-border bg-background/90 px-5 backdrop-blur md:px-8 lg:px-10">
          <div className="flex items-center gap-3 lg:hidden"><Shield className="size-5 text-primary" /><span className="font-display text-sm font-semibold tracking-wide">SENTINEL</span></div>
          <div className="hidden items-center gap-2 text-xs text-muted-foreground lg:flex"><Radio className="size-3 text-success" /><span>Live triage</span><span className="text-border">/</span><span>September 17, 2026</span></div>
          <div className="flex items-center gap-2 rounded-md border border-border bg-secondary/40 px-3 py-1.5 text-xs text-muted-foreground"><span className="size-1.5 rounded-full bg-primary" />SLA monitored</div>
        </header>
        <main className="mx-auto w-full max-w-[1500px] p-5 pb-28 md:p-8 lg:p-10">{children}</main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t border-border bg-sidebar/95 px-2 py-2 backdrop-blur lg:hidden" aria-label="Mobile navigation">
        {navItems.map((item) => {
          const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
          return <Link key={item.to} to={item.to} className={cn("flex min-h-12 flex-col items-center justify-center gap-1 rounded-md text-[10px]", active ? "text-primary" : "text-muted-foreground")}><item.icon className="size-4" />{item.label}</Link>;
        })}
      </nav>
    </div>
  );
}