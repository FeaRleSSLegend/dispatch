import { createFileRoute } from "@tanstack/react-router"
import { Check, FileSearch, GitCompareArrows, LoaderCircle, Route as RouteIcon } from "lucide-react"
import { useState } from "react"

import { PageHeading, SeverityBadge } from "@/components/incident-ui"
import { Button } from "@/components/ui/button"
import { useAnalyzeReport } from "@/hooks/useIncidents"
import { formatCategory } from "@/lib/incidents"

export const Route = createFileRoute("/new-report")({
  component: NewReport,
})

function NewReport() {
  const [report, setReport] = useState("")
  const analyze = useAnalyzeReport()

  const run = () => {
    if (!report.trim()) return
    analyze.mutate(report)
  }

  return (
    <div>
      <PageHeading
        eyebrow="Workspace / Analysis"
        title="Analyze a report"
        description="Review an incident description, its classification, redacted details, and suggested routing."
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(380px,.85fr)]">
        <section className="panel">
          <label htmlFor="report" className="section-label">Incident report</label>
          <textarea
            id="report"
            value={report}
            onChange={(event) => setReport(event.target.value)}
            placeholder="Paste the original incident report here…"
            className="app-textarea mt-4 min-h-80"
          />
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs leading-5 text-muted-foreground">Analysis only · No case will be created.</p>
            <Button onClick={run} disabled={!report.trim() || analyze.isPending}>
              {analyze.isPending ? (
                <LoaderCircle className="size-4 animate-spin" />
              ) : (
                <FileSearch className="size-4" />
              )}
              {analyze.isPending ? "Analyzing" : "Analyze report"}
            </Button>
          </div>
        </section>

        <section className="panel min-h-[420px]">
          {analyze.isPending ? (
            <div className="space-y-6" role="status" aria-label="Analyzing report" aria-busy="true">
              <p className="section-label">Analyzing report…</p>
              <div className="grid grid-cols-2 gap-3"><div className="data-skeleton h-28 rounded-2xl" /><div className="data-skeleton h-28 rounded-2xl" /></div>
              <div className="data-skeleton h-22 rounded-2xl" /><div className="data-skeleton h-22 rounded-2xl" /><div className="data-skeleton h-32 rounded-2xl" />
            </div>
          ) : analyze.isError ? (
            <div className="flex min-h-[380px] flex-col items-center justify-center text-center">
              <p className="text-sm font-semibold text-destructive">Analysis failed</p>
              <p className="mt-2 max-w-xs text-xs text-muted-foreground">
                {analyze.error instanceof Error ? analyze.error.message : "Unknown error"}
              </p>
              <Button variant="outline" size="sm" className="mt-4" onClick={run}>
                Retry
              </Button>
            </div>
          ) : !analyze.data ? (
            <div className="flex min-h-[380px] flex-col items-center justify-center text-center">
              <span className="flex size-12 items-center justify-center rounded-full border border-border bg-secondary/50">
                <FileSearch className="size-5 text-muted-foreground" />
              </span>
              <h2 className="mt-4 text-sm font-semibold">Ready to analyze</h2>
              <p className="mt-2 max-w-xs text-xs leading-5 text-muted-foreground">
                Classification and routing results will appear here when the analysis is complete.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <p className="section-label">Analysis complete</p>
                <span className="flex items-center gap-1.5 text-xs text-success">
                  <Check className="size-3.5" />
                  Analysis ready
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Result label="Category" value={formatCategory(analyze.data.category)} />
                <div className="result-block">
                  <p className="result-label">Severity</p>
                  <div className="mt-2">
                    <SeverityBadge severity={analyze.data.severity} />
                  </div>
                </div>
              </div>

              <Result
                label="Suggested routing"
                value={analyze.data.routed_to}
                icon={<RouteIcon className="size-4" />}
              />

              <Result
                label="Duplicate detection"
                value={
                  analyze.data.duplicate_of
                    ? `Duplicate of ${analyze.data.duplicate_of}`
                    : "No likely duplicate"
                }
                icon={<GitCompareArrows className="size-4" />}
              />

              <div className="result-block">
                <p className="result-label">Redacted output</p>
                <p className="mt-2 text-xs leading-6 text-muted-foreground">
                  {analyze.data.redacted}
                </p>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

function Result({
  label,
  value,
  icon,
}: {
  label: string
  value: string
  icon?: React.ReactNode
}) {
  return (
    <div className="result-block">
      <div className="flex items-center justify-between">
        <p className="result-label">{label}</p>
        <span className="text-primary">{icon}</span>
      </div>
      <p className="mt-2 text-sm leading-6">{value}</p>
    </div>
  )
}