import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Clock3, ShieldAlert, Siren, TimerReset } from "lucide-react";
import { IncidentTable, PageHeading } from "@/components/incident-ui";
import { Button } from "@/components/ui/button";

// No head() here: the home route inherits title/description/og/twitter from
// __root.tsx, and ships no og:image so serve-time hosting can inject the
// project's social preview (explicit og:image or latest screenshot).
export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Operations Overview — Dispatch" },
    { name: "description", content: "Live security incident statistics, priority queue, and response health." },
    { property: "og:title", content: "Operations Overview — Dispatch" },
    { property: "og:description", content: "Live security incident statistics and response health." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ]}),
  component: Index,
});

// IMPORTANT: Replace this placeholder. See ./README.md for routing conventions.
function Index() {
  return (
    <div>
      <PageHeading eyebrow="Operations overview" title="Incident command" description="A consolidated view of active threats, response posture, and the cases requiring immediate attention." action={<Button asChild><Link to="/new-report">Submit report <ArrowRight className="size-4" /></Link></Button>} />
      <section className="mb-10 grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Incident statistics">
        {[
          { label: "Active incidents", value: "18", delta: "+3 today", icon: ShieldAlert, tone: "text-severity-high" },
          { label: "Critical priority", value: "03", delta: "Requires action", icon: Siren, tone: "text-severity-critical" },
          { label: "Median triage time", value: "06m", delta: "↓ 18% this week", icon: Clock3, tone: "text-primary" },
          { label: "SLA compliance", value: "94%", delta: "Target 92%", icon: TimerReset, tone: "text-success" },
        ].map((stat) => <article key={stat.label} className="rounded-lg border border-border bg-card p-5"><div className="flex items-start justify-between"><p className="text-xs font-medium text-muted-foreground">{stat.label}</p><stat.icon className={`size-4 ${stat.tone}`} /></div><p className="mt-5 font-display text-3xl font-semibold">{stat.value}</p><p className="mt-2 text-[11px] text-muted-foreground">{stat.delta}</p></article>)}
      </section>
      <section>
        <div className="mb-4 flex items-end justify-between"><div><h2 className="font-display text-lg font-semibold">Priority queue</h2><p className="mt-1 text-xs text-muted-foreground">Sorted by severity and response urgency</p></div><Link to="/incidents" className="text-xs font-semibold text-primary hover:text-primary/80">View all incidents</Link></div>
        <IncidentTable limit={5} />
      </section>
    </div>
  );
}
