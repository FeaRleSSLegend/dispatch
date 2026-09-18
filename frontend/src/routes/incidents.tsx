import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/incidents")({
  head: () => ({ meta: [
    { title: "Incident Queue — Dispatch" }, { name: "description", content: "Review the severity-sorted security incident queue." },
    { property: "og:title", content: "Incident Queue — Dispatch" }, { property: "og:description", content: "Review the severity-sorted security incident queue." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ]}), component: IncidentsLayout,
});

function IncidentsLayout() { return <Outlet />; }