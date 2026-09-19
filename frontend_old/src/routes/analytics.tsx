import { createFileRoute } from "@tanstack/react-router"

import { PageHeading } from "@/components/incident-ui"
import { ErrorState, LoadingState } from "@/components/query-states"
import { useAnalytics } from "@/hooks/useIncidents"
import { formatCategory, type Category } from "@/lib/incidents"

export const Route = createFileRoute("/analytics")({
  component: Analytics,
})

const SEVERITY_COLORS: Record<string, string> = {
  high: "bg-severity-high",
  medium: "bg-severity-medium",
  low: "bg-severity-low",
}

function Analytics() {
  const { data, isLoading, isError, error, refetch } = useAnalytics()

  if (isLoading) return <LoadingState label="Loading analytics…" />

  if (isError || !data) {
    return (
      <div>
        <PageHeading
          eyebrow="Response intelligence"
          title="Analytics"
          description="Incident volume, severity distribution, and response performance."
        />
        <div className="rounded-lg border border-border bg-card">
          <ErrorState
            message={error instanceof Error ? error.message : "Unknown error"}
            onRetry={() => refetch()}
          />
        </div>
      </div>
    )
  }

  const maxCount = Math.max(1, ...data.volume_by_day.map((d) => d.count))
  const totalSeverity =
    Object.values(data.severity_distribution).reduce((a, b) => a + b, 0) || 1

  const severityRows = ["high", "medium", "low"].map((level) => {
    const count = data.severity_distribution[level] ?? 0
    return { level, count, pct: Math.round((count / totalSeverity) * 100) }
  })

  const categoryEntries = Object.entries(data.category_distribution)
  const topCategory =
    categoryEntries.length > 0
      ? formatCategory(
          categoryEntries.sort((a, b) => b[1] - a[1])[0]![0] as Category,
        )
      : "—"

  return (
    <div>
      <PageHeading
        eyebrow="Response intelligence"
        title="Analytics"
        description="A seven-day view of incident volume, severity distribution, and operational response performance."
      />

      <div className="grid gap-5 xl:grid-cols-[1.4fr_.6fr]">
        <section className="panel">
          <div className="flex items-end justify-between">
            <div>
              <p className="section-label">Incident volume</p>
              <p className="mt-2 text-xs text-muted-foreground">Last seven days</p>
            </div>
            <p className="font-display text-3xl font-semibold">
              {data.kpis.total_incidents}
            </p>
          </div>
          <div className="mt-10 flex h-56 items-end gap-3 border-b border-border px-2">
            {data.volume_by_day.map((day) => (
              <div key={day.date} className="flex h-full flex-1 flex-col justify-end gap-3">
                <div className="relative flex-1">
                  <div
                    className="absolute inset-x-0 bottom-0 rounded-t-sm bg-primary/70"
                    style={{ height: `${(day.count / maxCount) * 100}%` }}
                  />
                </div>
                <span className="pb-3 text-center text-[10px] text-muted-foreground">
                  {new Date(day.date).toLocaleDateString(undefined, {
                    weekday: "short",
                  })}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="panel">
          <p className="section-label">Severity distribution</p>
          <div className="mt-7 space-y-5">
            {severityRows.map((s) => (
              <div key={s.level}>
                <div className="mb-2 flex justify-between text-xs">
                  <span className="capitalize">{s.level}</span>
                  <span className="text-muted-foreground">
                    {s.count} · {s.pct}%
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-secondary">
                  <div
                    className={`h-full rounded-full ${SEVERITY_COLORS[s.level]}`}
                    style={{ width: `${s.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <article className="rounded-lg border border-border bg-card p-5">
          <p className="text-xs text-muted-foreground">Total incidents</p>
          <p className="mt-4 font-display text-2xl font-semibold">
            {data.kpis.total_incidents}
          </p>
        </article>
        <article className="rounded-lg border border-border bg-card p-5">
          <p className="text-xs text-muted-foreground">Active</p>
          <p className="mt-4 font-display text-2xl font-semibold">
            {data.kpis.active}
          </p>
        </article>
        <article className="rounded-lg border border-border bg-card p-5">
          <p className="text-xs text-muted-foreground">Top category</p>
          <p className="mt-4 font-display text-2xl font-semibold">{topCategory}</p>
        </article>
      </div>
    </div>
  )
}