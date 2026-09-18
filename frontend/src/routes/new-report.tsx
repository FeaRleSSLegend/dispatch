import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, FileSearch, GitCompareArrows, LoaderCircle, Route as RouteIcon, ShieldCheck } from "lucide-react";
import { PageHeading, SeverityBadge } from "@/components/incident-ui";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/new-report")({
  head: () => ({ meta: [
    { title: "New Incident Report — Dispatch" }, { name: "description", content: "Analyze and classify a new security incident report." },
    { property: "og:title", content: "New Incident Report — Dispatch" }, { property: "og:description", content: "Analyze and classify a new security incident report." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ]}), component: NewReport,
});

const sample = "Maria in Finance says she received six unexpected MFA prompts this morning. She approved one by mistake. Shortly after, a login from 185.220.101.14 appeared and a new payment recipient was added to the vendor portal.";

function NewReport() {
  const [report, setReport] = useState(""); const [analyzing, setAnalyzing] = useState(false); const [done, setDone] = useState(false);
  const analyze = () => { if (!report.trim()) return; setAnalyzing(true); setDone(false); window.setTimeout(() => { setAnalyzing(false); setDone(true); }, 750); };
  return <div><PageHeading eyebrow="Intake and enrichment" title="New report" description="Submit an unstructured incident report for classification, redaction, duplicate detection, and response routing." />
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(380px,.85fr)]"><section className="panel"><label htmlFor="report" className="section-label">Incident report</label><textarea id="report" value={report} onChange={(event) => setReport(event.target.value)} placeholder="Paste the original incident report here…" className="mt-4 min-h-80 w-full resize-y rounded-md border border-border bg-background p-4 text-sm leading-7 outline-none placeholder:text-muted-foreground focus:border-primary/60" /><div className="mt-4 flex flex-wrap items-center justify-between gap-3"><button onClick={() => setReport(sample)} className="text-xs font-semibold text-muted-foreground hover:text-foreground">Load sample report</button><Button onClick={analyze} disabled={!report.trim() || analyzing}>{analyzing ? <LoaderCircle className="size-4 animate-spin" /> : <FileSearch className="size-4" />}{analyzing ? "Analyzing" : "Analyze report"}</Button></div></section>
      <section className="panel min-h-[420px]">{!done ? <div className="flex min-h-[380px] flex-col items-center justify-center text-center"><span className="flex size-12 items-center justify-center rounded-full border border-border bg-secondary/50"><FileSearch className="size-5 text-muted-foreground" /></span><h2 className="mt-4 text-sm font-semibold">Analysis pending</h2><p className="mt-2 max-w-xs text-xs leading-5 text-muted-foreground">Classification and routing results will appear here after analysis.</p></div> : <div className="space-y-6"><div className="flex items-center justify-between"><p className="section-label">Analysis complete</p><span className="flex items-center gap-1.5 text-xs text-success"><Check className="size-3.5" />Validated</span></div><div className="grid grid-cols-2 gap-3"><Result label="Classification" value="Credential compromise" /><div className="result-block"><p className="result-label">Severity</p><div className="mt-2"><SeverityBadge severity="Critical" /></div></div></div><Result label="Extracted details" value="MFA fatigue · Unauthorized sign-in · Payment change" icon={<ShieldCheck className="size-4" />} /><Result label="Routing" value="Identity Response · Finance Security" icon={<RouteIcon className="size-4" />} /><Result label="Duplicate detection" value="Possible match · INC-2819 (82%)" icon={<GitCompareArrows className="size-4" />} /><div className="result-block"><p className="result-label">Redacted output</p><p className="mt-2 text-xs leading-6 text-muted-foreground">[PERSON REDACTED] in Finance received six unexpected MFA prompts. A login from [IP REDACTED] appeared and a new payment recipient was added.</p></div><Button className="w-full">Create incident</Button></div>}</section></div>
  </div>;
}

function Result({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) { return <div className="result-block"><div className="flex items-center justify-between"><p className="result-label">{label}</p><span className="text-primary">{icon}</span></div><p className="mt-2 text-sm leading-6">{value}</p></div>; }