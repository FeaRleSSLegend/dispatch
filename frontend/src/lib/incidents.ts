// Incident types mirror the output of the ML pipeline
// (ML_pipeline/src/pipeline.py → process_report()).
// The frontend reads from the API; this file holds types + display helpers.

export type Category =
  | "phishing"
  | "account_takeover"
  | "malware"
  | "data_leak"
  | "suspicious_activity"

export type Severity = "low" | "medium" | "high"

export type IncidentStatus = "new" | "triaged" | "investigating" | "resolved"

export type Entities = {
  ips: string[]
  urls: string[]
  account_refs: string[]
  organizations: string[]
  time_references: string[]
}

export type Incident = {
  id: string
  category: Category
  severity: Severity
  status: IncidentStatus
  routed_to: string
  report: string
  redacted: string
  entities: Entities
  submitted_at: string
  duplicate_of: string | null
  score: number | null
  department: string
}

// Populated by the API once the backend is wired up.
export const incidents: Incident[] = []

// --- Display helpers ------------------------------------------------------

export const severityRank: Record<Severity, number> = {
  high: 3,
  medium: 2,
  low: 1,
}

export const severityClass: Record<Severity, string> = {
  high: "severity-high",
  medium: "severity-medium",
  low: "severity-low",
}

export const severityLabel: Record<Severity, string> = {
  high: "High",
  medium: "Medium",
  low: "Low",
}

export function formatCategory(category: Category): string {
  return category
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

export function flattenEntities(entities: Entities): string[] {
  return [
    ...entities.ips,
    ...entities.urls,
    ...entities.account_refs,
    ...entities.organizations,
    ...entities.time_references,
  ]
}

export function entitiesByGroup(entities: Entities): Array<{ label: string; values: string[] }> {
  const groups = [
    { label: "IP addresses", values: entities.ips },
    { label: "URLs", values: entities.urls },
    { label: "Account refs", values: entities.account_refs },
    { label: "Organizations", values: entities.organizations },
    { label: "Time references", values: entities.time_references },
  ]
  return groups.filter((g) => g.values.length > 0)
}

export function timeAgo(iso: string): string {
  const then = new Date(iso).getTime()
  if (Number.isNaN(then)) return iso
  const seconds = Math.max(0, Math.floor((Date.now() - then) / 1000))
  if (seconds < 60) return `${seconds}s ago`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes} min ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hr${hours === 1 ? "" : "s"} ago`
  const days = Math.floor(hours / 24)
  return `${days} day${days === 1 ? "" : "s"} ago`
}