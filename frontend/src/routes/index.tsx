import { Link, createFileRoute } from "@tanstack/react-router"
import { ArrowRight, Bug, Database, Fingerprint, MailWarning, Plus } from "lucide-react"

import { IncidentTable, PageHeading } from "@/components/incident-ui"
import { EmptyState, ErrorState, LoadingState, MetricSkeletons } from "@/components/query-states"
import { Button } from "@/components/ui/button"
import { useIncidents } from "@/hooks/useIncidents"

export const Route = createFileRoute("/")({ component: Index })

function Index() {
  const { data, isLoading, isError, error, refetch } = useIncidents({ limit: 100 })
  const items = data?.items ?? []
  const countBy = (category: string) => items.filter((item) => item.category === category).length
  const stats = [
    { label: "Phishing", category: "phishing", context: "Email and credential attacks", icon: MailWarning },
    { label: "Account takeover", category: "account_takeover", context: "Unauthorized account access", icon: Fingerprint },
    { label: "Data leak", category: "data_leak", context: "Sensitive data exposure", icon: Database },
    { label: "Malware", category: "malware", context: "Malicious software reports", icon: Bug },
  ]

  return (
    <div>
      <PageHeading
        eyebrow="Workspace / Overview"
        title="Incident overview"
        description="Review the latest incident reports and open individual cases for investigation."
        action={<Button asChild><Link to="/new-report"><Plus size={17} aria-hidden="true" /> Analyze report</Link></Button>}
      />

      {isLoading ? <MetricSkeletons /> : (
        <section className="mb-9 grid grid-cols-2 gap-3 xl:grid-cols-4" aria-label="Incident categories">
          {stats.map((stat) => (
            <article className="stat-card" key={stat.label}>
              <div className="stat-card-heading"><span>{stat.label}</span><stat.icon aria-hidden="true" /></div>
              <div><p className="stat-card-value">{isError ? "—" : String(countBy(stat.category)).padStart(2, "0")}</p><p className="stat-card-caption">{stat.context}</p></div>
            </article>
          ))}
        </section>
      )}

      <section aria-label="Priority incidents">
        <div className="section-heading">
          <div><h2 className="section-title">Recent incidents</h2><p className="section-subtitle">Latest reports, newest first · category counts cover up to 100 incidents</p></div>
          <Link to="/incidents" className="text-action">View all <ArrowRight size={16} aria-hidden="true" /></Link>
        </div>
        {isLoading ? <LoadingState label="Loading incidents" rows={5} /> : isError ? (
          <div className="data-surface"><ErrorState message={error instanceof Error ? error.message : "Unable to retrieve incidents."} onRetry={() => refetch()} /></div>
        ) : items.length === 0 ? (
          <div className="data-surface"><EmptyState title="No incidents yet" description="Submitted incident reports will appear here." /></div>
        ) : <IncidentTable rows={items} limit={5} />}
      </section>
    </div>
  )
}
