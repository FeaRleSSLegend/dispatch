import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useNavigate,
  useRouterState,
} from '@tanstack/react-router'
import { useEffect } from 'react'
import { DashboardShell } from '@/components/dashboard-shell'
import { ReporterShell } from '@/components/reporter-shell'
import { AuthProvider, useAuth } from '@/lib/auth'

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

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error)
  const router = useRouter()

  useEffect(() => {
    // Add error reporting here if you wire one up later.
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

const publicPaths = ['/login', '/signup', '/admin/login', '/admin/signup']

function AuthGate() {
  const { session, ready } = useAuth()
  const navigate = useNavigate()
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const isPublic = publicPaths.includes(pathname)

  useEffect(() => {
    if (!ready) return
    if (!session) {
      if (!isPublic) navigate({ to: '/login', replace: true })
      return
    }
    if (session.role === 'user' && pathname !== '/report') {
      navigate({ to: '/report', replace: true })
    }
    if (session.role === 'admin' && (pathname === '/report' || isPublic)) {
      navigate({ to: '/', replace: true })
    }
  }, [ready, session, pathname, isPublic, navigate])

  if (isPublic) return <Outlet />
  if (!ready || !session) return <div className="min-h-screen bg-background" />
  if (session.role === 'user') {
    return (
      <ReporterShell>
        <Outlet />
      </ReporterShell>
    )
  }
  return (
    <DashboardShell>
      <Outlet />
    </DashboardShell>
  )
}