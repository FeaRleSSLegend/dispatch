import { Link } from "@tanstack/react-router"
import { ArrowRight } from "lucide-react"

import {
  formatCategory,
  severityClass,
  severityLabel,
  timeAgo,
  type Incident,
} from "@/lib/incidents"

export function SeverityBadge({ severity }: { severity: Incident["severity"] }) {
  return (
    <span className={`severity-badge ${severityClass[severity]}`}>
      <span className="severity-dot" aria-hidden="true" />
      {severityLabel[severity]}
    </span>
  )
}

export function IncidentTable({ rows, limit }: { rows: Incident[]; limit?: number }) {
  const visible = typeof limit === "number" ? rows.slice(0, limit) : rows

  return (
    <div className="data-surface">
      <div className="hidden overflow-x-auto lg:block">
        <table className="incident-table">
          <thead>
            <tr>
              <th scope="col">Reference</th>
              <th scope="col">Category</th>
              <th scope="col">Severity</th>
              <th scope="col">Department</th>
              <th scope="col">Received</th>
              <th scope="col">Status</th>
              <th scope="col"><span className="sr-only">Open incident</span></th>
            </tr>
          </thead>
          <tbody>
            {visible.map((incident) => (
              <tr key={incident.id}>
                <td className="font-mono text-xs font-medium">{incident.id}</td>
                <td className="font-medium">{formatCategory(incident.category)}</td>
                <td><SeverityBadge severity={incident.severity} /></td>
                <td className="text-muted-foreground">{incident.department}</td>
                <td className="whitespace-nowrap text-muted-foreground">{timeAgo(incident.submitted_at)}</td>
                <td><span className="status-badge">{incident.status}</span></td>
                <td>
                  <Link to="/incidents/$incidentId" params={{ incidentId: incident.id }} aria-label={`Open incident ${incident.id}`} className="incident-open">
                    <ArrowRight size={16} aria-hidden="true" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className="incident-mobile-list lg:hidden" aria-label="Incidents">
        {visible.map((incident) => (
          <li key={incident.id} className="min-w-0">
          <Link to="/incidents/$incidentId" params={{ incidentId: incident.id }} className="incident-mobile-card" aria-label={`Open ${incident.id}, ${formatCategory(incident.category)}`}>
            <div className="incident-mobile-card-top">
              <div className="min-w-0">
                <span className="font-mono text-[11px] text-muted-foreground">{incident.id}</span>
                <p className="mt-2 text-[15px] font-semibold tracking-tight">{formatCategory(incident.category)}</p>
              </div>
              <ArrowRight size={18} className="mt-1 shrink-0 text-muted-foreground" aria-hidden="true" />
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <SeverityBadge severity={incident.severity} />
              <span className="status-badge">{incident.status}</span>
            </div>
            <div className="incident-mobile-meta"><span>{incident.department}</span><span>{timeAgo(incident.submitted_at)}</span></div>
          </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function PageHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string
  title: string
  description: string
  action?: React.ReactNode
}) {
  return (
    <div className="page-heading">
      <div className="min-w-0">
        <p className="page-eyebrow">{eyebrow}</p>
        <h1 className="page-title">{title}</h1>
        <p className="page-description">{description}</p>
      </div>
      {action}
    </div>
  )
}
