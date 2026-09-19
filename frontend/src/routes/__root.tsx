import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useNavigate,
  useRouterState,
} from "@tanstack/react-router"
import { useEffect } from "react"
import { DashboardShell } from "@/components/dashboard-shell"
import { ReporterShell } from "@/components/reporter-shell"
import { AuthProvider, useAuth } from "@/lib/auth"

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  )
}

function ErrorComponent({
  error,
  reset,
}: {
  error: unknown
  reset: () => void
}) {
  const router = useRouter()

  useEffect(() => {
    console.error("Route error:", error)
  }, [error])

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate()
              reset()
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  )
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
})

function RootComponent() {
  const { queryClient } = Route.useRouteContext()

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AuthGate />
      </AuthProvider>
    </QueryClientProvider>
  )
}

const publicPaths = ["/login", "/signup", "/admin/login"]

function AuthGate() {
  const { session, ready } = useAuth()
  const navigate = useNavigate()
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const isPublic = publicPaths.includes(pathname)

  useEffect(() => {
    if (!ready) return

    if (!session) {
      if (!isPublic) navigate({ to: "/login", replace: true })
      return
    }

    // Users belong on /report; admins belong everywhere except /report when logged in
    if (session.role === "user" && pathname !== "/report") {
      navigate({ to: "/report", replace: true })
    }
    if (session.role === "admin" && isPublic) {
      navigate({ to: "/", replace: true })
    }
  }, [ready, session, pathname, isPublic, navigate])

  // Public pages render immediately
  if (isPublic) return <Outlet />

  // Keep the screen informative while the session is verified or redirect begins.
  if (!ready || !session) return <SessionLoading />

  // User role → ReporterShell
  if (session.role === "user") {
    return (
      <ReporterShell>
        <Outlet />
      </ReporterShell>
    )
  }

  // Admin role → DashboardShell
  return (
    <DashboardShell>
      <Outlet />
    </DashboardShell>
  )
}
function SessionLoading() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-5" role="status" aria-label="Preparing your workspace" aria-busy="true">
      <div className="w-full max-w-sm rounded-3xl border border-border bg-card p-8">
        <p className="text-lg font-semibold tracking-tight">dispatch<span className="text-muted-foreground">.</span></p>
        <p className="mt-2 text-xs text-muted-foreground">Preparing your workspace…</p>
        <div className="mt-9 space-y-3" aria-hidden="true"><div className="data-skeleton h-4 w-2/3" /><div className="data-skeleton h-12 w-full rounded-2xl" /><div className="data-skeleton h-12 w-full rounded-2xl" /></div>
      </div>
    </main>
  )
}
