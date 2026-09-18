# Complete SENTINEL operations suite

## Scope
- Expand the navigation with a responder workspace, team directory, audit log, integrations, and settings.
- Keep every screen consistent with the approved cinematic dark design.
- Use realistic mock records and local state so filters, tabs, toggles, connection actions, assignments, and preferences work.
- Preserve the existing overview, queue, report analysis, incident detail, and analytics flows.

## Pages
- Responder workspace: assigned cases, shift metrics, handoff status, and quick actions.
- Team: analyst availability, workload, specialization, and assignment controls.
- Audit log: searchable/filterable event history with event details.
- Integrations: monitoring and response tools with local connect/disconnect states.
- Settings: organization profile, triage rules, notifications, privacy, and appearance preferences.

## Technical details
- Add each destination as a TanStack route with unique metadata.
- Extend the shared sidebar and mobile navigation without changing the established visual language.
- Keep data frontend-only; changes persist for the current browser session only.
- Validate all routes and key controls at desktop and mobile widths.
