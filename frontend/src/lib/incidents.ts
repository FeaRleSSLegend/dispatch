export type Severity = "Critical" | "High" | "Medium" | "Low";
export type IncidentStatus = "Escalated" | "Investigating" | "Pending" | "Contained";

export type Incident = {
  id: string;
  type: string;
  severity: Severity;
  department: string;
  time: string;
  status: IncidentStatus;
  score: number;
  report: string;
  indicators: string[];
  duplicate: string;
  route: string;
  redacted: string;
};

export const incidents: Incident[] = [
  {
    id: "INC-2841",
    type: "Credential compromise",
    severity: "Critical",
    department: "Finance",
    time: "8 min ago",
    status: "Escalated",
    score: 96,
    report: "An accounts payable specialist received repeated MFA prompts after opening a supplier invoice. A successful sign-in from an unfamiliar IP followed, and a new payment beneficiary was created.",
    indicators: ["IP 185.220.101.14", "Impossible travel detected", "New OAuth grant", "MFA fatigue pattern"],
    duplicate: "Possible match · INC-2819 (82%)",
    route: "Identity Response · Finance Security",
    redacted: "An accounts payable specialist received repeated MFA prompts after opening a supplier invoice. A successful sign-in from [IP REDACTED] followed, and a new payment beneficiary was created.",
  },
  {
    id: "INC-2837",
    type: "Malware detection",
    severity: "High",
    department: "Operations",
    time: "24 min ago",
    status: "Investigating",
    score: 84,
    report: "Endpoint protection blocked an unsigned executable launched from a compressed attachment on an operations workstation.",
    indicators: ["SHA256 4a8d…19ce", "Unsigned executable", "Archive attachment"],
    duplicate: "No likely duplicate",
    route: "Endpoint Security",
    redacted: "Endpoint protection blocked an unsigned executable on workstation [DEVICE REDACTED].",
  },
  {
    id: "INC-2832",
    type: "Sensitive data exposure",
    severity: "High",
    department: "People",
    time: "41 min ago",
    status: "Pending",
    score: 78,
    report: "A spreadsheet containing employee contact details was shared using a public link.",
    indicators: ["Public sharing enabled", "1,284 records", "External access logged"],
    duplicate: "Possible match · INC-2794 (61%)",
    route: "Data Protection · People Operations",
    redacted: "A spreadsheet containing [COUNT REDACTED] employee contact records was shared using a public link.",
  },
  {
    id: "INC-2828",
    type: "Policy violation",
    severity: "Medium",
    department: "Engineering",
    time: "1 hr ago",
    status: "Investigating",
    score: 57,
    report: "A repository token was committed to a private development branch and detected by secret scanning.",
    indicators: ["Repository secret", "Token revoked", "Private branch"],
    duplicate: "No likely duplicate",
    route: "Application Security",
    redacted: "A repository token was committed to [REPOSITORY REDACTED] and detected by secret scanning.",
  },
  {
    id: "INC-2823",
    type: "Suspicious email",
    severity: "Low",
    department: "Sales",
    time: "2 hrs ago",
    status: "Contained",
    score: 28,
    report: "A sales representative reported a suspicious calendar invitation with an external attachment.",
    indicators: ["External sender", "Attachment quarantined"],
    duplicate: "No likely duplicate",
    route: "Messaging Security",
    redacted: "A sales representative reported a suspicious calendar invitation with an external attachment.",
  },
];

export const severityRank: Record<Severity, number> = { Critical: 4, High: 3, Medium: 2, Low: 1 };

export const severityClass: Record<Severity, string> = {
  Critical: "severity-critical",
  High: "severity-high",
  Medium: "severity-medium",
  Low: "severity-low",
};