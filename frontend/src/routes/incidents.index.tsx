import { createFileRoute } from "@tanstack/react-router"
import { Search } from "lucide-react"
import { useEffect, useState } from "react"

import { IncidentTable, PageHeading } from "@/components/incident-ui"
import { EmptyState, ErrorState, LoadingState } from "@/components/query-states"
import { useIncidents } from "@/hooks/useIncidents"

export const Route = createFileRoute("/incidents/")({
  component: IncidentQueue,
})

function IncidentQueue() {
  const [query, setQuery] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState("")

  useEffect(() => {
    const timeout = window.setTimeout(() => setDebouncedQuery(query), 280)
    return () => window.clearTimeout(timeout)
  }, [query])

  const params = {
    limit: 100,
    ...(debouncedQuery.trim() ? { q: debouncedQuery.trim() } : {}),
  }
  const { data, isLoading, isError, error, refetch } = useIncidents(params)

  const items = data?.items ?? []
  const count = data?.total ?? 0

  return (
    <div>
      <PageHeading
        eyebrow="Workspace / Incidents"
        title="Incident queue"
        description="Find and review reported incidents, severity, and response status."
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            aria-label="Search incidents"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search incidents"
            className="app-field !pl-10"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          {isLoading ? "Loading incidents…" : isError ? "Results unavailable" : `Showing ${items.length} of ${count} · newest first`}
        </p>
      </div>

      {isLoading ? (
        <LoadingState label="Loading incidents…" />
      ) : isError ? (
        <div className="data-surface">
          <ErrorState
            message={error instanceof Error ? error.message : "Unknown error"}
            onRetry={() => refetch()}
          />
        </div>
      ) : items.length === 0 ? (
        <div className="data-surface">
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