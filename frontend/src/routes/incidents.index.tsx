import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useState } from "react";
import { IncidentTable, PageHeading } from "@/components/incident-ui";

export const Route = createFileRoute("/incidents/")({
  head: () => ({ meta: [
    { title: "Incident Queue — Dispatch" }, { name: "description", content: "Review the severity-sorted security incident queue." },
    { property: "og:title", content: "Incident Queue — Dispatch" }, { property: "og:description", content: "Review the severity-sorted security incident queue." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ]}),
  component: IncidentQueue,
});

function IncidentQueue() {
  const [query, setQuery] = useState("");
  return <div><PageHeading eyebrow="Triage workspace" title="Incident queue" description="Review and route reports by severity, operational impact, and response status." />
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div className="relative w-full max-w-sm"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search incidents" className="h-10 w-full rounded-md border border-border bg-card pl-10 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary/60" /></div><p className="text-xs text-muted-foreground">5 incidents · highest priority first</p></div>
    {query && <p className="mb-3 text-xs text-primary">Local search active for “{query}”</p>}<IncidentTable />
  </div>;
}