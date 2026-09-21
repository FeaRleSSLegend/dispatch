import { createFileRoute } from "@tanstack/react-router"
import { FileSearch, LoaderCircle } from "lucide-react"
import { useEffect, useState } from "react"

import { PageHeading } from "@/components/incident-ui"
import { EmptyState, ErrorState, LoadingState } from "@/components/query-states"
import { Button } from "@/components/ui/button"
import { useIncidents, useSubmitReport } from "@/hooks/useIncidents"
import { formatCategory, timeAgo, type Incident } from "@/lib/incidents"

export const Route = createFileRoute("/report")({
  component: ReportPage,
})

function ReportPage() {
  const [department, setDepartment] = useState("Finance")
  const [report, setReport] = useState("")
  const { data, isLoading, isError, error, refetch } = useIncidents({ limit: 100 })
  const submit = useSubmitReport()
  const [justSubmitted, setJustSubmitted] = useState<Incident[]>([])

  useEffect(() => {
    if (data?.items.length && justSubmitted.length) {
      const ids = new Set(data.items.map((i) => i.id))
      const remaining = justSubmitted.filter((i) => !ids.has(i.id))
      if (remaining.length !== justSubmitted.length) setJustSubmitted(remaining)
    }
  }, [data, justSubmitted])

  const apiItems = data?.items ?? []
  const seen = new Set(apiItems.map((i) => i.id))
  const combined = [...justSubmitted.filter((i) => !seen.has(i.id)), ...apiItems]

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!report.trim()) return
    submit.mutate(
      { text: report, department },
      {
        onSuccess: (incident) => {
          setJustSubmitted((prev) => [incident, ...prev])
          setReport("")
          refetch()
        },
      },
    )
  }

  return (
    <div>
      <PageHeading
        eyebrow="Report an incident"
        title="Report an incident"
        description="Describe what happened. Your report will be sent to the response team for review and routing."
      />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(320px,.7fr)]">
        <form onSubmit={onSubmit} className="panel">
          <label htmlFor="department" className="section-label">Department</label>
          <select
            id="department"
            value={department}
            onChange={(event) => setDepartment(event.target.value)}
            className="app-field app-select mt-2"
          >
            {["Finance", "Engineering", "People Ops", "Sales", "Legal", "IT Support"].map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          <label htmlFor="details" className="section-label mt-6 block">What happened?</label>
          <textarea
            id="details"
            value={report}
            onChange={(event) => setReport(event.target.value)}
            placeholder="Describe the emails, prompts, logins, or anything unusual you noticed…"
            className="app-textarea mt-2 min-h-72"
          />
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">The response team can view the original and redacted report.</p>
            <Button type="submit" disabled={!report.trim() || submit.isPending}>
              {submit.isPending ? <LoaderCircle className="size-4 animate-spin" /> : <FileSearch className="size-4" />}
              {submit.isPending ? "Sending" : "Submit report"}
            </Button>
          </div>
          {submit.isError && (
            <p className="mt-3 text-xs text-destructive">
              {submit.error instanceof Error ? submit.error.message : "Submission failed."}
            </p>
          )}
        </form>

        <section className="panel">
          <p className="section-label">Your reports</p>
          {isLoading ? (
            <LoadingState label="Loading your reports…" rows={3} />
          ) : isError ? (
            <ErrorState
              message={error instanceof Error ? error.message : "Unable to load reports."}
              onRetry={() => refetch()}
            />
          ) : combined.length === 0 ? (
            <EmptyState
              title="Nothing submitted yet"
              description="Reports you send will appear here with their reference numbers."
            />
          ) : (
            <ul className="mt-4 space-y-3">
              {combined.slice(0, 20).map((item) => (
                <li key={item.id} className="result-block">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-mono text-xs">{item.id}</p>
                    <span className="text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
                      {timeAgo(item.submitted_at)}
                    </span>
                  </div>
                  <p className="mt-2 text-xs leading-6 text-muted-foreground">
                    {item.report.slice(0, 120)}
                    {item.report.length > 120 ? "…" : ""}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="status-badge">{formatCategory(item.category)}</span>
                    <span className="status-badge">{item.status}</span>
                    <span className="status-badge">{item.department}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}
