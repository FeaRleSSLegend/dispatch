import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2, Copy, GitMerge, Route as RouteIcon, ShieldCheck } from "lucide-react";
import { PageHeading, SeverityBadge } from "@/components/incident-ui";
import { Button } from "@/components/ui/button";
import { incidents } from "@/lib/incidents";

export const Route = createFileRoute("/incidents/$incidentId")({
  head: () => ({ meta: [
    { title: "Incident Review — SENTINEL" }, { name: "description", content: "Review incident evidence, routing, duplicates, and redacted report output." },
    { property: "og:title", content: "Incident Review — SENTINEL" }, { property: "og:description", content: "Review incident evidence and response routing." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ]}), component: IncidentDetail,
});

function IncidentDetail() {
  const { incidentId } = Route.useParams();
  const incident = incidents.find((item) => item.id === incidentId) ?? incidents[0];
  if (!incident) return null;
  return <div><Link to="/incidents" className="mb-6 inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground"><ArrowLeft className="size-3.5" />Back to queue</Link>
    <PageHeading eyebrow="Incident review" title={incident.id} description={`${incident.type} · Reported ${incident.time}`} action={<div className="flex items-center gap-3"><SeverityBadge severity={incident.severity} /><Button size="sm"><CheckCircle2 className="size-4" />Assign to me</Button></div>} />
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,.75fr)]">
      <div className="space-y-5"><section className="panel"><p className="section-label">Original report</p><p className="mt-4 text-sm leading-7 text-foreground/90">{incident.report}</p></section><section className="panel"><p className="section-label">Technical indicators</p><div className="mt-4 grid gap-2 sm:grid-cols-2">{incident.indicators.map((indicator) => <div key={indicator} className="rounded-md border border-border bg-background px-3 py-3 font-mono text-xs text-muted-foreground">{indicator}</div>)}</div></section><section className="panel"><div className="flex items-center justify-between"><p className="section-label">PII-redacted version</p><ShieldCheck className="size-4 text-success" /></div><p className="mt-4 text-sm leading-7 text-muted-foreground">{incident.redacted}</p><Button variant="ghost" size="sm" className="mt-3"><Copy className="size-3.5" />Copy redacted text</Button></section></div>
      <aside className="space-y-5"><section className="panel"><p className="section-label">Classification confidence</p><div className="mt-5 flex items-end justify-between"><span className="font-display text-4xl font-semibold">{incident.score}%</span><span className="text-xs text-muted-foreground">High confidence</span></div><div className="mt-4 h-1.5 overflow-hidden rounded-full bg-secondary"><div className="h-full bg-primary" style={{ width: `${incident.score}%` }} /></div></section><section className="panel"><GitMerge className="size-4 text-primary" /><p className="mt-4 section-label">Duplicate status</p><p className="mt-2 text-sm">{incident.duplicate}</p></section><section className="panel"><RouteIcon className="size-4 text-primary" /><p className="mt-4 section-label">Routing</p><p className="mt-2 text-sm">{incident.route}</p><p className="mt-2 text-xs text-muted-foreground">Response target · 15 minutes</p></section></aside>
    </div>
  </div>;
}