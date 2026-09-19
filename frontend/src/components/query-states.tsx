import { AlertCircle, Inbox, RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"

function SkeletonBar({ className = "" }: { className?: string }) {
  return <div className={`data-skeleton ${className}`} aria-hidden="true" />
}

export function LoadingState({ label = "Loading…", rows = 4 }: { label?: string; rows?: number }) {
  return (
    <div className="data-surface p-4 sm:p-6" role="status" aria-label={label} aria-busy="true">
      <span className="sr-only">{label}</span>
      <div className="mb-7 flex items-center justify-between gap-4"><SkeletonBar className="h-5 w-36" /><SkeletonBar className="h-9 w-20" /></div>
      <div className="space-y-4">
        {Array.from({ length: rows }, (_, index) => (
          <div key={index} className="flex items-center gap-4 rounded-2xl border border-border p-4">
            <SkeletonBar className="h-10 w-10 shrink-0 rounded-xl" />
            <div className="min-w-0 flex-1 space-y-2"><SkeletonBar className="h-3.5 w-2/3 max-w-48" /><SkeletonBar className="h-3 w-1/2 max-w-32" /></div>
            <SkeletonBar className="hidden h-6 w-20 rounded-full sm:block" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function MetricSkeletons({ count = 4 }: { count?: number }) {
  return (
    <div className="mb-8 grid grid-cols-2 gap-3 xl:grid-cols-4" aria-label="Loading incident metrics" role="status" aria-busy="true">
      <span className="sr-only">Loading incident metrics</span>
      {Array.from({ length: count }, (_, index) => (
        <div className="stat-card" key={index}><SkeletonBar className="h-4 w-24 max-w-full" /><div><SkeletonBar className="h-10 w-16" /><SkeletonBar className="mt-3 h-3 w-32 max-w-full" /></div></div>
      ))}
    </div>
  )
}

export function AnalyticsSkeleton() {
  return (
    <div role="status" aria-label="Loading analytics" aria-busy="true">
      <span className="sr-only">Loading analytics</span>
      <div className="grid gap-5 xl:grid-cols-[1.4fr_.6fr]">
        <div className="panel"><SkeletonBar className="h-5 w-40" /><div className="mt-10 flex h-56 items-end gap-4">{[68, 43, 75, 52, 89, 57, 77].map((height, index) => <div key={index} className="flex h-full min-w-0 flex-1 items-end"><div className="data-skeleton w-full rounded-t-xl" style={{ height: `${height}%` }} /></div>)}</div></div>
        <div className="panel"><SkeletonBar className="h-5 w-36" /><div className="mt-10 space-y-7">{[0, 1, 2].map((item) => <div key={item}><SkeletonBar className="h-4 w-32" /><SkeletonBar className="mt-3 h-2 w-full" /></div>)}</div></div>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">{[0, 1, 2].map((item) => <div className="panel" key={item}><SkeletonBar className="h-4 w-24" /><SkeletonBar className="mt-7 h-9 w-20" /></div>)}</div>
    </div>
  )
}

export function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex min-h-[230px] flex-col items-center justify-center gap-4 p-6 text-center" role="alert">
      <span className="flex size-12 items-center justify-center rounded-2xl border border-destructive/40 bg-destructive/10"><AlertCircle className="size-5 text-destructive" /></span>
      <div><p className="text-sm font-semibold">Unable to load this information</p><p className="mt-2 max-w-sm break-words text-xs leading-6 text-muted-foreground">{message}</p></div>
      <Button variant="outline" size="sm" onClick={onRetry}><RefreshCw size={15} /> Try again</Button>
    </div>
  )
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex min-h-[230px] flex-col items-center justify-center p-8 text-center">
      <span className="mb-4 grid size-12 place-items-center rounded-2xl border border-border bg-secondary"><Inbox size={20} className="text-muted-foreground" aria-hidden="true" /></span>
      <h2 className="text-sm font-semibold">{title}</h2><p className="mt-2 max-w-xs text-xs leading-6 text-muted-foreground">{description}</p>
    </div>
  )
}
