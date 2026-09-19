import { useNavigate } from "@tanstack/react-router"
import { LogOut, Shield } from "lucide-react"
import type { ReactNode } from "react"

import { useAuth } from "@/lib/auth"

export function ReporterShell({ children }: { children: ReactNode }) {
  const { session, signOut } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="app-shell">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-primary focus:p-3 focus:text-primary-foreground">Skip to content</a>
      <header className="reporter-header">
        <div className="app-brand">
          <span className="brand-mark"><Shield size={20} strokeWidth={1.6} aria-hidden="true" /></span>
          <div className="min-w-0"><p className="brand-name">dispatch<span className="text-muted-foreground">.</span></p><p className="brand-caption">Incident reporting</p></div>
        </div>
        <div className="flex min-w-0 items-center gap-3">
          <span className="hidden max-w-48 truncate text-xs text-muted-foreground sm:block">{session?.email}</span>
          <button type="button" onClick={() => { signOut(); navigate({ to: "/login", replace: true }) }} className="interactive-button flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-2xl border border-border bg-card px-3.5 text-xs font-medium text-foreground hover:bg-secondary" aria-label="Sign out">
            <LogOut size={16} strokeWidth={1.7} aria-hidden="true" /><span>Sign out</span>
          </button>
        </div>
      </header>
      <main id="main-content" className="reporter-content"><div className="page-enter">{children}</div></main>
    </div>
  )
}
