import { createFileRoute } from "@tanstack/react-router"
import { Check, FileSearch, LoaderCircle, ShieldCheck } from "lucide-react"
import { useState } from "react"

import { PageHeading } from "@/components/incident-ui"
import { Button } from "@/components/ui/button"
import { useSubmitReport } from "@/hooks/useIncidents"
import type { Incident } from "@/lib/incidents"

export const Route = createFileRoute("/report")({
  component: ReportPage,
})

function ReportPage() {
  const [department, setDepartment] = useState("Finance")
  const [report, setReport] = useState("")
  const [submitted, setSubmitted] = useState<Incident[]>([])
  const submit = useSubmitReport()

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!report.trim()) return
    submit.mutate(
      { text: report, department },
      {
        onSuccess: (incident) => {
          setSubmitted((prev) => [incident, ...prev])
          setReport("")
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
              {submit.isPending ? (
                <LoaderCircle className="size-4 animate-spin" />
              ) : (
                <FileSearch className="size-4" />
              )}
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
          <p className="section-label">Submitted this session</p>
          {submitted.length === 0 ? (
            <div className="flex min-h-64 flex-col items-center justify-center text-center">
              <span className="flex size-12 items-center justify-center rounded-full border border-border bg-secondary/50">
                <ShieldCheck className="size-5 text-muted-foreground" />
              </span>
              <h2 className="mt-4 text-sm font-semibold">Nothing submitted yet</h2>
              <p className="mt-2 max-w-xs text-xs leading-5 text-muted-foreground">
                Reports sent during this session will appear here with their reference numbers.
              </p>
            </div>
          ) : (
            <ul className="mt-4 space-y-3">
              {submitted.map((item) => (
                <li key={item.id} className="result-block">
                  <div className="flex items-center justify-between">
                    <p className="font-mono text-xs">{item.id}</p>
                    <span className="flex items-center gap-1.5 text-[11px] text-success">
                      <Check className="size-3.5" />
                      Received · {item.department}
                    </span>
                  </div>
                  <p className="mt-2 text-xs leading-6 text-muted-foreground">
                    {item.report.slice(0, 120)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}