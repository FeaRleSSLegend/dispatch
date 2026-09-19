import { Link, createFileRoute } from "@tanstack/react-router"
import {
  ArrowLeft,
  CheckCircle2,
  Copy,
  GitMerge,
  Route as RouteIcon,
  ShieldCheck,
} from "lucide-react"

import { ErrorState, LoadingState } from "@/components/query-states"
import { PageHeading, SeverityBadge } from "@/components/incident-ui"
import { Button } from "@/components/ui/button"
import { useIncident } from "@/hooks/useIncidents"
import { entitiesByGroup, formatCategory, timeAgo } from "@/lib/incidents"

export const Route = createFileRoute("/incidents/$incidentId")({
  component: IncidentDetail,
})

function IncidentDetail() {
  const { incidentId } = Route.useParams()
  const { data: incident, isLoading, isError, error, refetch } = useIncident(incidentId)

  if (isLoading) {
    return <LoadingState label="Loading incident…" />
  }

  if (isError || !incident) {
    return (
      <div>
        <Link
          to="/incidents"
          className="mb-6 inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Back to queue
        </Link>
        <div className="rounded-lg border border-border bg-card">
          <ErrorState
            message={
              error instanceof Error
                ? error.message
                : `Incident ${incidentId} not found`
            }
            onRetry={() => refetch()}
          />
        </div>
      </div>
    )
  }

  const grouped = entitiesByGroup(incident.entities)

  return (
    <div>
      <Link
        to="/incidents"
        className="mb-6 inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        Back to queue
      </Link>

      <PageHeading
        eyebrow="Incident review"
        title={incident.id}
        description={`${formatCategory(incident.category)} · Submitted ${timeAgo(incident.submitted_at)}`}
        action={
          <div className="flex items-center gap-3">
            <SeverityBadge severity={incident.severity} />
            <Button size="sm">
              <CheckCircle2 className="size-4" />
              Assign to me
            </Button>
          </div>
        }
      />

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,.75fr)]">
        <div className="space-y-5">
          <section className="panel">
            <p className="section-label">Original report</p>
            <p className="mt-4 text-sm leading-7 text-foreground/90">{incident.report}</p>
          </section>

          <section className="panel">
            <p className="section-label">Extracted entities</p>
            {grouped.length === 0 ? (
              <p className="mt-4 text-sm text-muted-foreground">No entities detected.</p>
            ) : (
              <div className="mt-4 space-y-4">
                {grouped.map((group) => (
                  <div key={group.label}>
                    <p className="result-label">{group.label}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {group.values.map((value) => (
                        <span
                          key={`${group.label}-${value}`}
                          className="rounded-md border border-border bg-background px-3 py-1.5 font-mono text-xs text-muted-foreground"
                        >
                          {value}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="panel">
            <div className="flex items-center justify-between">
              <p className="section-label">PII-redacted version</p>
              <ShieldCheck className="size-4 text-success" />
            </div>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">{incident.redacted}</p>
            <Button
              variant="ghost"
              size="sm"
              className="mt-3"
              onClick={() => navigator.clipboard.writeText(incident.redacted)}
            >
              <Copy className="size-3.5" />
              Copy redacted text
            </Button>
          </section>
        </div>

        <aside className="space-y-5">
          {incident.score !== null && incident.score !== undefined && (
            <section className="panel">
              <p className="section-label">Classification confidence</p>
              <div className="mt-5 flex items-end justify-between">
                <span className="font-display text-4xl font-semibold">
                  {Math.round(incident.score)}%
                </span>
              </div>
              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full bg-primary"
                  style={{ width: `${Math.min(100, Math.max(0, incident.score))}%` }}
                />
              </div>
            </section>
          )}

          <section className="panel">
            <GitMerge className="size-4 text-primary" />
            <p className="mt-4 section-label">Duplicate status</p>
            <p className="mt-2 text-sm">
              {incident.duplicate_of
                ? `Duplicate of ${incident.duplicate_of}`
                : "No likely duplicate"}
            </p>
          </section>

          <section className="panel">
            <RouteIcon className="size-4 text-primary" />
            <p className="mt-4 section-label">Routed to</p>
            <p className="mt-2 text-sm">{incident.routed_to}</p>
            <p className="mt-2 text-xs text-muted-foreground">
              Department · {incident.department}
            </p>
          </section>
        </aside>
      </div>
    </div>
  )
}