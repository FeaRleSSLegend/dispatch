import { Link, createFileRoute } from "@tanstack/react-router"
import { ArrowRight } from "lucide-react"

import { IncidentTable, PageHeading } from "@/components/incident-ui"
import { EmptyState, ErrorState, LoadingState } from "@/components/query-states"
import { Button } from "@/components/ui/button"
import { useIncidents } from "@/hooks/useIncidents"

export const Route = createFileRoute("/")({
  component: Index,
})

function Index() {
  const { data, isLoading, isError, error, refetch } = useIncidents({ limit: 100 })

  const items = data?.items ?? []
  const countBy = (cat: string) => items.filter((i) => i.category === cat).length

  const stats = [
    {
      label: "Phishing",
      value: countBy("phishing"),
      delta: "Email and credential attacks",
    },
    {
      label: "Account takeover",
      value: countBy("account_takeover"),
      delta: "Unauthorized access",
    },
    {
      label: "Data leak",
      value: countBy("data_leak"),
      delta: "Exposed sensitive data",
    },
    {
      label: "Malware",
      value: countBy("malware"),
      delta: "Malicious software",
    },
  ]

  return (
    <div>
      <PageHeading
        eyebrow="Operations overview"
        title="Incident command"
        description="A consolidated view of active threats, response posture, and the cases requiring immediate attention."
        action={
          <Button asChild>
            <Link to="/new-report">
              Submit report <ArrowRight className="size-4" />
            </Link>
          </Button>
        }
      />

      <section
        className="mb-10 grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
        aria-label="Incident categories"
      >
        {stats.map((stat) => (
          <article
            key={stat.label}
            className="rounded-lg border border-border bg-card p-5"
          >
            <p className="text-xs font-medium text-muted-foreground">{stat.label}</p>
            <p className="mt-5 font-display text-3xl font-semibold">
              {isLoading ? "—" : String(stat.value).padStart(2, "0")}
            </p>
            <p className="mt-2 text-[11px] text-muted-foreground">{stat.delta}</p>
          </article>
        ))}
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="font-display text-lg font-semibold">Priority queue</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Sorted by severity and response urgency
            </p>
          </div>
          <Link
            to="/incidents"
            className="text-xs font-semibold text-primary hover:text-primary/80"
          >
            View all incidents
          </Link>
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
              title="No incidents yet"
              description="Reports will appear here as they are submitted."
            />
          </div>
        ) : (
          <IncidentTable rows={items} limit={5} />
        )}
      </section>
    </div>
  )
}