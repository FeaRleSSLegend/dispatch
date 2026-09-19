import { Link, useNavigate, useRouterState } from "@tanstack/react-router"
import { Activity, BarChart3, FilePlus2, LayoutDashboard, LogOut, Shield } from "lucide-react"
import { useEffect, useState, type ReactNode } from "react"

import { useAuth } from "@/lib/auth"
import { cn } from "@/lib/utils"

const navItems = [
  { label: "Overview", to: "/" as const, icon: LayoutDashboard },
  { label: "Incident Queue", to: "/incidents" as const, icon: Activity },
  { label: "New Report", to: "/new-report" as const, icon: FilePlus2 },
  { label: "Analytics", to: "/analytics" as const, icon: BarChart3 },
]

function useClock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(id)
  }, [])
  return now
}

function formatDate(d: Date) {
  return d.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

function formatTime(d: Date) {
  return d.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  })
}

export function DashboardShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const { session, signOut } = useAuth()
  const navigate = useNavigate()
  const now = useClock()

  return (
    <div className="min-h-screen bg-background text-foreground">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 border-r border-border bg-sidebar lg:flex lg:flex-col">
        <div className="flex h-20 items-center gap-3 border-b border-border px-7">
          <span className="flex size-9 items-center justify-center rounded-md border border-primary/30 bg-primary/10 text-primary">
            <Shield className="size-4" />
          </span>
          <div>
            <p className="font-display text-base font-semibold tracking-wide">Dispatch</p>
            <p className="mt-0.5 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Incident command
            </p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-4 py-7" aria-label="Primary navigation">
          {navItems.map((item) => {
            const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to)
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex h-11 items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors",
                  active
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
                )}
              >
                <item.icon className={cn("size-4", active && "text-primary")} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-border p-5">
          <div className="flex items-center gap-3">
            <span className="relative flex size-8 items-center justify-center rounded-full bg-secondary text-xs font-semibold">
              {(session?.name ?? "SO").slice(0, 2).toUpperCase()}
              <span className="absolute bottom-0 right-0 size-2 rounded-full bg-success ring-2 ring-sidebar" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-xs font-medium">{session?.name ?? "Signed in"}</p>
              <p className="truncate text-[11px] text-muted-foreground">
                {session?.email ?? "No email"}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              signOut()
              navigate({ to: "/admin/login", replace: true })
            }}
            className="mt-4 flex h-9 w-full items-center justify-center gap-2 rounded-md border border-border bg-secondary/40 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <LogOut className="size-3.5" />
            Sign out
          </button>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-border bg-background/90 px-5 backdrop-blur md:px-8 lg:px-10">
          <div className="flex items-center gap-3 lg:hidden">
            <Shield className="size-5 text-primary" />
            <span className="font-display text-sm font-semibold tracking-wide">Dispatch</span>
          </div>

          <div className="hidden items-center gap-3 text-xs text-muted-foreground lg:flex">
            <span>{formatDate(now)}</span>
            <span className="text-border">|</span>
            <span className="font-mono tabular-nums">{formatTime(now)}</span>
          </div>

          <div className="text-xs text-muted-foreground">
            {session?.role === "admin" ? "Admin session" : "Reporter session"}
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1500px] p-5 pb-28 md:p-8 lg:p-10">{children}</main>
      </div>

      <nav
        className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t border-border bg-sidebar/95 px-2 py-2 backdrop-blur lg:hidden"
        aria-label="Mobile navigation"
      >
        {navItems.map((item) => {
          const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to)
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex min-h-12 flex-col items-center justify-center gap-1 rounded-md text-[10px]",
                active ? "text-primary" : "text-muted-foreground",
              )}
            >
              <item.icon className="size-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}