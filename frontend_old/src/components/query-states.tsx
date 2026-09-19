import { AlertCircle, Loader2, RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"

export function LoadingState({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex min-h-[200px] flex-col items-center justify-center gap-3 text-center">
      <Loader2 className="size-5 animate-spin text-muted-foreground" />
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  )
}

export function ErrorState({
  message,
  onRetry,
}: {
  message: string
  onRetry: () => void
}) {
  return (
    <div className="flex min-h-[200px] flex-col items-center justify-center gap-3 text-center">
      <span className="flex size-10 items-center justify-center rounded-full border border-destructive/40 bg-destructive/10">
        <AlertCircle className="size-4 text-destructive" />
      </span>
      <div>
        <p className="text-sm font-semibold">Could not reach the API</p>
        <p className="mt-1 max-w-xs text-xs leading-5 text-muted-foreground">{message}</p>
      </div>
      <Button variant="outline" size="sm" onClick={onRetry}>
        <RefreshCw className="size-3.5" />
        Retry
      </Button>
    </div>
  )
}

export function EmptyState({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="flex min-h-[200px] flex-col items-center justify-center p-8 text-center">
      <h2 className="text-sm font-semibold">{title}</h2>
      <p className="mt-2 max-w-xs text-xs leading-5 text-muted-foreground">{description}</p>
    </div>
  )
}