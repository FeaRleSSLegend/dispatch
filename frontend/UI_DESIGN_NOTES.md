# Dispatch interface refresh

## Scope
The authentication screens, analyst dashboard and reporter workspace follow the supplied monochrome reference: near-black canvas, graphite cards, delicate borders, generous radii, understated iconography and Inter. No backend, ML pipeline, authentication rules, endpoint, or database logic has been changed. The frontend API client now uses the Vite same-origin proxy in development and distinguishes connection errors from credential errors. Routes and data contracts are unchanged.

## Where to edit styles
- `src/styles.css`: colour, typography, spacing radii, Tailwind theme and reusable small utilities.
- `src/styles/layout.css`: dashboard sidebar, header, mobile navigation, account sheet, reporter shell.
- `src/styles/components.css`: headings, cards, incident list/table, inputs, authentication layout and skeleton shapes.
- `src/styles/motion.css`: button, entrance, sheet and skeleton effects, including reduced-motion support.
- `src/components/ui/button.tsx`: shared button variants and pressed states.
- `src/components/{dashboard-shell,reporter-shell,auth-ui,incident-ui,query-states}.tsx`: shared UI markup and responsive behaviour.

## Authentication visual direction
The desktop authentication panel contains only the bundled `public/incident-map.svg` artwork. The left-hand marketing copy, badge and process cards, plus all small access headings above the auth form titles, have been removed. Mobile screens display the form without a decorative image panel.

## Navigation and behaviour
The desktop sidebar retains the four analyst destinations and always exposes sign out. The mobile floating dock retains all four destinations and adds an Account control containing sign out; the header account shortcut opens the same dialog. The dialog supports Escape, keyboard focus cycling and closing by tapping the backdrop. The dashboard uses skeletons during API loading, mobile incident cards to avoid horizontal scrolling, and CSS entrance animations that honour reduced-motion settings. Incident search waits briefly before calling the existing endpoint.

## Content accuracy and limits
The `/new-report` endpoint analyses text but does not submit a case, so its visible label now says **Analyze report** (the URL is unchanged). Its sample-report filler was removed. The previously shown **Assign to me** button had no handler or supporting assignment endpoint; this UI-only placeholder was removed rather than presenting an action that cannot work. The overview category counts reflect the latest 100 incidents returned by the existing query, and its copy makes this limit explicit. The incident queue is ordered newest first by the current backend, not by severity. The analytics volume is last seven days, while severity and totals cover all incidents. The reporter's submitted list covers the current page session, not historic submissions.

## Verification
TypeScript/TSX source syntax and CSS were parsed; local API-client mock tests passed, and the auth layout was checked at desktop and mobile sizes in a browser preview. A full production build and real admin sign-in still require `cd frontend && npm install && npm run build && npm run lint` and a running configured backend. Package installation failed in this environment, so live Supabase authentication cannot be claimed. See `SETUP_AND_VERIFICATION.md`. The original backend and ML pipeline remain byte-for-byte unchanged.
