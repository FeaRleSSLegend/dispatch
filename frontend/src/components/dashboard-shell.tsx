import { Link, useNavigate, useRouterState } from "@tanstack/react-router"
import {
  Activity, ArrowUpRight, BarChart3, FileSearch, LayoutDashboard,
  LogOut, Plus, Shield, UserRound, X,
} from "lucide-react"
import { useEffect, useRef, useState, type ReactNode } from "react"

import { useAuth } from "@/lib/auth"

const navItems = [
  { label: "Overview", shortLabel: "Overview", to: "/" as const, icon: LayoutDashboard },
  { label: "Incident queue", shortLabel: "Queue", to: "/incidents" as const, icon: Activity },
  { label: "Analyze report", shortLabel: "Analyze", to: "/new-report" as const, icon: FileSearch },
  { label: "Analytics", shortLabel: "Analytics", to: "/analytics" as const, icon: BarChart3 },
]

function isActive(pathname: string, to: string) {
  return to === "/" ? pathname === "/" : pathname.startsWith(to)
}

function currentSection(pathname: string) {
  if (pathname.startsWith("/incidents/") && pathname !== "/incidents/") return "Incident review"
  return navItems.find((item) => isActive(pathname, item.to))?.label ?? "Workspace"
}

function useClock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 60_000)
    return () => window.clearInterval(id)
  }, [])
  return now
}

function Brand({ caption = "Incident response" }: { caption?: string }) {
  return (
    <Link to="/" className="app-brand" aria-label="Dispatch overview">
      <span className="brand-mark"><Shield size={20} strokeWidth={1.6} /></span>
      <span className="min-w-0">
        <span className="brand-name block">dispatch<span className="text-muted-foreground">.</span></span>
        {caption && <span className="brand-caption block">{caption}</span>}
      </span>
    </Link>
  )
}

export function DashboardShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const { session, signOut } = useAuth()
  const navigate = useNavigate()
  const now = useClock()
  const [accountOpen, setAccountOpen] = useState(false)
  const closeButton = useRef<HTMLButtonElement>(null)
  const signOutButton = useRef<HTMLButtonElement>(null)
  const accountSheet = useRef<HTMLElement>(null)
  const accountTrigger = useRef<HTMLButtonElement | null>(null)

  const closeAccount = () => {
    setAccountOpen(false)
    accountTrigger.current?.focus()
  }

  useEffect(() => {
    if (!accountOpen) return
    closeButton.current?.focus()
    const oldOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setAccountOpen(false)
        accountTrigger.current?.focus()
      }
      if (event.key === "Tab" && accountSheet.current) {
        if (event.shiftKey && document.activeElement === closeButton.current) {
          event.preventDefault()
          signOutButton.current?.focus()
        } else if (!event.shiftKey && document.activeElement === signOutButton.current) {
          event.preventDefault()
          closeButton.current?.focus()
        }
      }
    }
    const desktop = window.matchMedia("(min-width: 1024px)")
    const onResize = () => { if (desktop.matches) setAccountOpen(false) }
    document.addEventListener("keydown", onKeyDown)
    desktop.addEventListener("change", onResize)
    return () => {
      document.body.style.overflow = oldOverflow
      document.removeEventListener("keydown", onKeyDown)
      desktop.removeEventListener("change", onResize)
    }
  }, [accountOpen])

  const handleSignOut = () => {
    setAccountOpen(false)
    signOut()
    navigate({ to: "/admin/login", replace: true })
  }

  const initials = (session?.name ?? "User")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase()

  return (
    <div className="app-shell">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-primary focus:p-3 focus:text-primary-foreground">
        Skip to content
      </a>

      <aside className="app-sidebar" aria-label="Workspace sidebar">
        <div className="sidebar-brand"><Brand /></div>
        <nav className="desktop-nav" aria-label="Primary navigation">
          <p className="nav-label">Workspace</p>
          <div className="space-y-1">
            {navItems.map((item) => (
              <Link key={item.to} to={item.to} className="nav-link" data-active={isActive(pathname, item.to)} aria-current={isActive(pathname, item.to) ? "page" : undefined}>
                <item.icon aria-hidden="true" />
                <span>{item.label}</span>
                {isActive(pathname, item.to) && <ArrowUpRight className="ml-auto opacity-50" aria-hidden="true" />}
              </Link>
            ))}
          </div>
        </nav>
        <div className="sidebar-account">
          <div className="account-identity">
            <span className="account-avatar" aria-hidden="true">{initials}</span>
            <span className="account-details">
              <strong>{session?.name ?? "Signed in"}</strong>
              <span>{session?.email ?? ""}</span>
            </span>
          </div>
          <button type="button" className="signout-button" onClick={handleSignOut}>
            <LogOut size={17} strokeWidth={1.7} aria-hidden="true" /> Sign out
          </button>
        </div>
      </aside>

      <div className="app-workspace">
        <header className="app-header">
          <div className="lg:hidden"><Brand caption="" /></div>
          <div className="hidden lg:block">
            <p className="header-title">{currentSection(pathname)}</p>
            <p className="header-subtitle">Incident response workspace</p>
          </div>
          <div className="header-actions">
            <span className="header-clock hidden xl:block" aria-label="Current date and time">
              {now.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })} · {now.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}
            </span>
            <Link to="/new-report" className="icon-action" aria-label="Analyze a report" title="Analyze a report">
              <Plus size={20} strokeWidth={1.7} aria-hidden="true" />
            </Link>
            <button type="button" className="icon-action mobile-account-trigger" aria-label="Open account menu" aria-expanded={accountOpen} aria-controls="mobile-account-sheet" onClick={(event) => { accountTrigger.current = event.currentTarget; setAccountOpen(true) }}>
              <UserRound size={19} strokeWidth={1.7} aria-hidden="true" />
            </button>
          </div>
        </header>

        <main id="main-content" className="app-content">
          <div key={pathname} className="page-enter">{children}</div>
        </main>
      </div>

      <nav className="mobile-dock" aria-label="Mobile navigation">
        {navItems.map((item) => (
          <Link key={item.to} to={item.to} className="mobile-nav-item" data-active={isActive(pathname, item.to)} aria-current={isActive(pathname, item.to) ? "page" : undefined} onClick={() => setAccountOpen(false)}>
            <item.icon aria-hidden="true" />
            <span>{item.shortLabel}</span>
          </Link>
        ))}
        <button type="button" className="mobile-nav-item" aria-label="Account and sign out" aria-expanded={accountOpen} aria-controls="mobile-account-sheet" onClick={(event) => { accountTrigger.current = event.currentTarget; if (accountOpen) closeAccount(); else setAccountOpen(true) }}>
          <UserRound aria-hidden="true" /><span>Account</span>
        </button>
      </nav>

      {accountOpen && (
        <>
          <button type="button" className="account-backdrop" aria-label="Close account menu" onClick={closeAccount} tabIndex={-1} />
          <section ref={accountSheet} id="mobile-account-sheet" className="account-sheet" role="dialog" aria-modal="true" aria-labelledby="account-menu-heading">
            <div className="sheet-heading">
              <div>
                <h2 className="sheet-title" id="account-menu-heading">Your account</h2>
                <p className="sheet-subtitle">Manage your session</p>
              </div>
              <button ref={closeButton} type="button" className="sheet-close" aria-label="Close account menu" onClick={closeAccount}><X size={17} /></button>
            </div>
            <div className="account-identity my-4 !px-0">
              <span className="account-avatar" aria-hidden="true">{initials}</span>
              <span className="account-details"><strong>{session?.name ?? "Signed in"}</strong><span>{session?.email ?? ""}</span></span>
            </div>
            <button ref={signOutButton} type="button" className="sheet-signout" onClick={handleSignOut}>
              <LogOut size={17} aria-hidden="true" /> Sign out
            </button>
          </section>
        </>
      )}
    </div>
  )
}
