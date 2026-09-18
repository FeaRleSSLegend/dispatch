import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { incidents, severityClass, type Incident } from "@/lib/incidents";

export function SeverityBadge({ severity }: { severity: Incident["severity"] }) {
  return <span className={`severity-badge ${severityClass[severity]}`}><span className="severity-dot" />{severity}</span>;
}

export function IncidentTable({ limit }: { limit?: number }) {
  const rows = typeof limit === "number" ? incidents.slice(0, limit) : incidents;
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[850px] text-left">
          <thead><tr className="border-b border-border bg-secondary/30 text-[10px] uppercase tracking-[0.14em] text-muted-foreground"><th className="px-5 py-4 font-medium">Incident</th><th className="px-5 py-4 font-medium">Type</th><th className="px-5 py-4 font-medium">Severity</th><th className="px-5 py-4 font-medium">Department</th><th className="px-5 py-4 font-medium">Detected</th><th className="px-5 py-4 font-medium">Status</th><th className="px-5 py-4" /></tr></thead>
          <tbody>{rows.map((incident) => <tr key={incident.id} className="group border-b border-border/70 last:border-0 hover:bg-secondary/25"><td className="px-5 py-4 font-mono text-xs text-foreground">{incident.id}</td><td className="px-5 py-4 text-sm font-medium">{incident.type}</td><td className="px-5 py-4"><SeverityBadge severity={incident.severity} /></td><td className="px-5 py-4 text-sm text-muted-foreground">{incident.department}</td><td className="px-5 py-4 text-xs text-muted-foreground">{incident.time}</td><td className="px-5 py-4"><span className="status-badge">{incident.status}</span></td><td className="px-5 py-4"><Link to="/incidents/$incidentId" params={{ incidentId: incident.id }} aria-label={`Open ${incident.id}`} className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"><ArrowRight className="size-4" /></Link></td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}

export function PageHeading({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: React.ReactNode }) {
  return <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">{eyebrow}</p><h1 className="font-display text-3xl font-semibold md:text-4xl">{title}</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p></div>{action}</div>;
}