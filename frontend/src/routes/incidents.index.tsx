import { createFileRoute } from "@tanstack/react-router"
import { Search } from "lucide-react"
import { useState } from "react"

import { IncidentTable, PageHeading } from "@/components/incident-ui"
import { EmptyState, ErrorState, LoadingState } from "@/components/query-states"
import { useIncidents } from "@/hooks/useIncidents"

export const Route = createFileRoute("/incidents/")({
  component: IncidentQueue,
})

function IncidentQueue() {
  const [query, setQuery] = useState("")
  const params = {
    limit: 100,
    ...(query.trim() ? { q: query.trim() } : {}),
  }
  const { data, isLoading, isError, error, refetch } = useIncidents(params)

  const items = data?.items ?? []
  const count = data?.total ?? 0

  return (
    <div>
      <PageHeading
        eyebrow="Triage workspace"
        title="Incident queue"
        description="Review and route reports by severity, operational impact, and response status."
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search incidents"
            className="h-10 w-full rounded-md border border-border bg-card pl-10 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary/60"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          {count} incident{count === 1 ? "" : "s"} · highest priority first
        </p>
      </div>

      {isLoading ? (
        <LoadingState label="Loading incidents…" />
      ) : isError ? (
        <div className="rounded-lg border border-border bg-card">
          <ErrorState
            message={error instanceof Error ? error.message : "Unknown error"}
            onRetry={() => refetch()}
          />
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-lg border border-border bg-card">
          <EmptyState
            title={query ? "No matching incidents" : "No incidents yet"}
            description={
              query
                ? "Try a different search term."
                : "Reports will appear here as they are submitted."
            }
          />
        </div>
      ) : (
        <IncidentTable rows={items} />
      )}
    </div>
  )
}